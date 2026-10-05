import "server-only";

// Server-to-server client for the NotesApp API (https://www.notesapp.name.ng/docs).
// Key scopes needed: read:posts, write:posts, read:bookings, read:orders, read:earnings.

const BASE = process.env.NOTESAPP_API_BASE || "https://www.notesapp.name.ng/api";

export class NotesAppError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

async function call<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {}
): Promise<T> {
  const key = process.env.NOTESAPP_API_KEY;
  if (!key) throw new NotesAppError(500, "not_configured", "NOTESAPP_API_KEY is not set");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;
  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new NotesAppError(
      res.status,
      body?.error?.code || "error",
      body?.error?.message || res.statusText
    );
  }
  return body as T;
}

export type RemotePost = { id: string; slug: string; url: string; status: string };

export type PostInput = {
  title: string;
  content: string;
  status?: "draft" | "published";
  tags?: string[];
  categories?: string[];
  featured_image?: string;
  premium?: boolean;
};

export const me = () => call<{ username: string; plan: string; payouts_ready: boolean }>("/v1/me");

export const createPost = (p: PostInput, idempotencyKey: string) =>
  call<RemotePost>("/v1/posts", { method: "POST", body: JSON.stringify(p), idempotencyKey });

export const updatePost = (id: string, p: Partial<PostInput>) =>
  call<RemotePost>(`/v1/posts/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(p) });

export const listPosts = (qs = "") => call<{ data: RemotePost[]; next_cursor: string | null }>(`/v1/posts${qs}`);
export const listBookings = (qs = "") => call<{ data: unknown[]; next_cursor: string | null }>(`/v1/bookings${qs}`);
export const listOrders = (qs = "") => call<{ data: unknown[]; next_cursor: string | null }>(`/v1/orders${qs}`);
export const getEarnings = (qs = "") =>
  call<{ summary: Record<string, { count: number; net_kobo: number }>; data: unknown[]; next_cursor: string | null }>(
    `/v1/earnings${qs}`
  );
