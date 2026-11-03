import "server-only";
import { adminDb } from "./firebase-admin";
import { getPost, listPosts } from "./notesapp";

// Pulls posts from NotesApp into the Firestore `notes` collection that the
// site renders from. Used by the webhook (post.* events) and by the admin
// "Import from NotesApp" action.
//
// NotesApp payload field names are read defensively (several aliases per
// field) so the mapping keeps working if the API adds or renames fields.

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

/** Accepts a post object, or an event `data` that wraps one ({ post: {...} } / { object: {...} }). */
export function extractPost(data: unknown): AnyObj | null {
  if (!data || typeof data !== "object") return null;
  const d = data as AnyObj;
  for (const k of ["post", "object"]) {
    if (d[k] && typeof d[k] === "object") return d[k] as AnyObj;
  }
  return d;
}

function postId(p: AnyObj): string | undefined {
  const id = pick(p, "id", "post_id");
  return id === undefined ? undefined : String(id);
}

function postContent(p: AnyObj): string | undefined {
  return str(pick(p, "content", "markdown", "body", "content_markdown"));
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
  const date = toISO(pick(p, "published_at", "publishedAt", "created_at", "createdAt", "date"));
  const status = pick(p, "status") === "published" ? "published" : "draft";
  const categories = strList(pick(p, "categories"));
  const tags = strList(pick(p, "tags"));
  const image = str(pick(p, "featured_image", "featuredImage", "cover_image", "image"));
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

/** Hide the local copy of a post that was deleted/unpublished on NotesApp. */
export async function unpublishNoteForPost(raw: AnyObj): Promise<void> {
  const remoteId = postId(raw);
  if (!remoteId) return;
  const snap = await adminDb()
    .collection("notes")
    .where("notesappId", "==", remoteId)
    .get();
  await Promise.all(snap.docs.map((d) => d.ref.update({ status: "draft" })));
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
