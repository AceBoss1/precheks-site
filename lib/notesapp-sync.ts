import "server-only";
import { adminDb } from "./firebase-admin";
import { getPost, listPosts } from "./notesapp";

// Pulls posts from NotesApp into the Firestore `notes` collection that the
// site renders from. Used by the `post.published` webhook and by the
// import endpoint (admin button + scheduled sync).
//
// Post shape (https://www.naapp.tech/docs): id, slug, url, title, status,
// date, tags, categories, featured_image, premium; `content` (Markdown) is
// only returned by GET /v1/posts/{id}, so list items are hydrated from it.

type AnyObj = Record<string, unknown>;

const DEFAULT_AUTHOR = {
  name: "Chimdinma Onwuegbu",
  role: "Founder & Lead Consultant",
  avatar: "/images/headshots/chimdinma-onwuegbu-2-professional.jpeg",
};

function pick(o: AnyObj, ...keys: string[]): unknown {
  for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function strList(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v
    .map((x) => (typeof x === "string" ? x : str((x as AnyObj)?.name)))
    .filter((x): x is string => !!x);
}

function toISO(v: unknown): string | undefined {
  if (typeof v === "number") return new Date(v < 1e12 ? v * 1000 : v).toISOString();
  if (typeof v === "string") {
    const t = Date.parse(v);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return undefined;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Accepts a post object, or an event `data` that wraps one ({ post: {...} }). */
export function extractPost(data: unknown): AnyObj | null {
  if (!data || typeof data !== "object") return null;
  const d = data as AnyObj;
  return d.post && typeof d.post === "object" ? (d.post as AnyObj) : d;
}

function postId(p: AnyObj): string | undefined {
  const id = pick(p, "id");
  return id === undefined ? undefined : String(id);
}

function postContent(p: AnyObj): string | undefined {
  return str(pick(p, "content"));
}

/** Fetch the full post when the payload we got doesn't carry the body. */
async function hydrate(p: AnyObj): Promise<AnyObj> {
  const id = postId(p);
  if (postContent(p) || !id) return p;
  try {
    return { ...p, ...((await getPost(id)) as AnyObj) };
  } catch {
    return p;
  }
}

/**
 * Create or update the local note for a NotesApp post.
 * Matches an existing note by `notesappId`, then by slug; otherwise creates one.
 * Only fields NotesApp actually sent are overwritten, so local-only fields
 * (author, counters, etc.) are preserved.
 */
export async function upsertNoteFromPost(
  raw: AnyObj
): Promise<{ id: string; created: boolean } | null> {
  const p = await hydrate(raw);
  const remoteId = postId(p);
  const title = str(pick(p, "title"));
  if (!remoteId || !title) return null;

  const content = postContent(p);
  const slug = str(pick(p, "slug")) || slugify(title);
  const date = toISO(pick(p, "date", "published_at", "created_at"));
  // Premium posts are subscriber-only on NotesApp — don't publish their
  // full text openly here; keep them as drafts.
  const premium = pick(p, "premium") === true;
  const status = pick(p, "status") === "published" && !premium ? "published" : "draft";
  const categories = strList(pick(p, "categories"));
  const tags = strList(pick(p, "tags"));
  const image = str(pick(p, "featured_image"));
  const url = str(pick(p, "url"));

  const col = adminDb().collection("notes");
  let existing = await col.where("notesappId", "==", remoteId).limit(1).get();
  if (existing.empty) existing = await col.where("slug", "==", slug).limit(1).get();

  const synced = {
    notesappId: remoteId,
    ...(url ? { notesappUrl: url } : {}),
    notesappSyncedAt: new Date().toISOString(),
  };

  if (!existing.empty) {
    const ref = existing.docs[0].ref;
    await ref.update({
      title,
      status,
      ...(content !== undefined ? { content } : {}),
      ...(categories ? { categories } : {}),
      ...(tags ? { tags } : {}),
      ...(image ? { featured_image: image } : {}),
      // Keep the original date on existing notes so edits don't reorder them.
      ...(existing.docs[0].get("date") ? {} : { date: date || new Date().toISOString() }),
      ...synced,
    });
    return { id: ref.id, created: false };
  }

  // Never create an empty note (e.g. if fetching the post's content failed).
  if (!content) return null;

  const ref = await col.add({
    title,
    slug,
    date: date || new Date().toISOString(),
    categories: categories || [],
    tags: tags || [],
    featured_image: image || "",
    content: content || "",
    author: DEFAULT_AUTHOR.name,
    author_role: DEFAULT_AUTHOR.role,
    author_avatar: DEFAULT_AUTHOR.avatar,
    status,
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    ...synced,
  });
  return { id: ref.id, created: true };
}

/** Page through every NotesApp post and upsert each one. */
export async function importAllPosts(): Promise<{ created: number; updated: number; skipped: number }> {
  const result = { created: 0, updated: 0, skipped: 0 };
  let cursor: string | null = null;
  do {
    const page: Awaited<ReturnType<typeof listPosts>> = await listPosts(
      `?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`
    );
    for (const post of page.data) {
      const r = await upsertNoteFromPost(post as unknown as AnyObj);
      if (!r) result.skipped++;
      else if (r.created) result.created++;
      else result.updated++;
    }
    cursor = page.next_cursor;
  } while (cursor);
  return result;
}
