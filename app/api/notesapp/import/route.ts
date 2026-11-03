import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase-admin";
import { NotesAppError } from "@/lib/notesapp";
import { importAllPosts } from "@/lib/notesapp-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST with an admin Firebase ID token as Bearer.
// Pulls every NotesApp post into Firestore `notes` (create or update).
export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await importAllPosts()) });
  } catch (e) {
    if (e instanceof NotesAppError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: e.status === 429 ? 429 : 502 });
    }
    throw e;
  }
}
