import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase-admin";
import { createPost, updatePost, NotesAppError } from "@/lib/notesapp";

export const runtime = "nodejs";

// POST { noteId } with an admin Firebase ID token as Bearer.
// Creates the note on NotesApp (idempotent), or PATCHes it if already synced.
export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { noteId } = await req.json().catch(() => ({}));
  if (!noteId || typeof noteId !== "string") {
    return NextResponse.json({ error: "noteId required" }, { status: 400 });
  }

  const ref = adminDb().collection("notes").doc(noteId);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: "not found" }, { status: 404 });
  const n = snap.data()!;

  const payload = {
    title: String(n.title).slice(0, 140),
    content: String(n.content).slice(0, 100000),
    status: n.status === "published" ? ("published" as const) : ("draft" as const),
    tags: (n.tags || []).slice(0, 10),
    categories: (n.categories || []).slice(0, 5),
    ...(typeof n.featured_image === "string" && n.featured_image.startsWith("https://")
      ? { featured_image: n.featured_image }
      : {}),
  };

  try {
    const remote = n.notesappId
      ? await updatePost(n.notesappId, payload)
      : await createPost(payload, `precheks-note-${noteId}`);
    await ref.update({
      notesappId: remote.id,
      notesappUrl: remote.url ?? null,
      notesappSyncedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, id: remote.id, url: remote.url });
  } catch (e) {
    if (e instanceof NotesAppError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: e.status === 429 ? 429 : 502 });
    }
    throw e;
  }
}
