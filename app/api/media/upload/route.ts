import { NextResponse } from "next/server";
import { requireUser } from "@/lib/firebase-admin";
import { createUpload, NotesAppError } from "@/lib/notesapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel caps request bodies at ~4.5 MB; the browser shrinks bigger images first (lib/upload.ts).
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

// POST multipart/form-data { file } with a Firebase ID token as Bearer.
// Stores the image in NotesApp's media bucket (R2) and returns { url }.
// The bytes go server-to-server (here → R2 presigned URL), so the bucket
// needs no CORS rule for this domain and the API key never reaches the browser.
export async function POST(req: Request) {
  if (!(await requireUser(req))) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }
  if (!TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 4 MB)." }, { status: 413 });
  }

  try {
    const ticket = await createUpload({ filename: file.name || "image", content_type: file.type, size: file.size });
    const put = await fetch(ticket.upload_url, {
      method: "PUT",
      headers: { ...ticket.headers, "Content-Type": file.type, "Content-Length": String(file.size) },
      body: Buffer.from(await file.arrayBuffer()),
    });
    if (!put.ok) {
      console.error("R2 upload failed", put.status, await put.text().catch(() => ""));
      return NextResponse.json({ error: "Upload to NotesApp storage failed." }, { status: 502 });
    }
    return NextResponse.json({ url: ticket.public_url });
  } catch (e) {
    if (e instanceof NotesAppError) {
      return NextResponse.json({ error: `NotesApp: ${e.message}`, code: e.code }, { status: e.status === 429 ? 429 : 502 });
    }
    throw e;
  }
}
