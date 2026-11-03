import { auth } from "./firebase";

// Uploads an image to NotesApp's media storage (R2) through our own
// /api/media/upload route and returns its public URL. Replaces the old
// Cloudinary uploader.

const MAX_BYTES = 4 * 1024 * 1024; // server limit (Vercel request body cap)
const MAX_SIDE = 2400;

/** Re-encode a too-large JPEG/PNG/WebP as WebP within MAX_SIDE px. */
async function shrink(file: File): Promise<File> {
  if (file.size <= MAX_BYTES || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.[A-Za-z0-9]{1,5}$/, "") + ".webp", { type: "image/webp" });
}

export async function uploadImage(original: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to upload images.");
  const file = await shrink(original);
  if (file.size > MAX_BYTES) throw new Error("Image is too large (max 4 MB).");

  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/media/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.url) throw new Error(body.error || "Upload failed");
  return body.url as string;
}
