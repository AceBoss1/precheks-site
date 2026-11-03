import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase-admin";
import { NotesAppError } from "@/lib/notesapp";
import { importAllPosts } from "@/lib/notesapp-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// One request per post (to fetch its Markdown) — allow time for that.
export const maxDuration = 60;

// Pulls every NotesApp post into Firestore `notes` (create or update).
// POST: admin Firebase ID token as Bearer (the /admin/notes button).
// GET:  `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends this
//       automatically when CRON_SECRET is set; see vercel.json).
export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return runImport();
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return runImport();
}

async function runImport() {
  try {
    return NextResponse.json({ ok: true, ...(await importAllPosts()) });
  } catch (e) {
    if (e instanceof NotesAppError) {
      return NextResponse.json({ error: e.code, message: e.message }, { status: e.status === 429 ? 429 : 502 });
    }
    throw e;
  }
}
