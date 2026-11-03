import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase-admin";
import { API_BASE, apiKey, probe } from "@/lib/notesapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrBody = { error?: { code?: string; message?: string } };

// Admin-only diagnostics for the NotesApp connection. Never returns the
// key's secret — only its public id (the part before the dot).
export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const raw = process.env.NOTESAPP_API_KEY;
  const key = apiKey();
  const keyId = key?.split(".")[0];

  const keyProblems: string[] = [];
  if (!raw) keyProblems.push("NOTESAPP_API_KEY is not set on the server.");
  else {
    if (raw !== raw.trim()) keyProblems.push("The value has spaces or line breaks around it (ignored automatically).");
    if (/^["']|["']$/.test(raw.trim())) keyProblems.push("The value is wrapped in quotes (ignored automatically).");
    if (/^Bearer\s/i.test(raw.trim())) keyProblems.push('The value starts with "Bearer " (ignored automatically).');
    if (key && !/^nak_[^.]+\.[^.]+$/.test(key))
      keyProblems.push("The key doesn't look like nak_<id>.<secret> — it may be cut off or the wrong value.");
  }

  const env = {
    NOTESAPP_API_KEY: !!raw,
    NOTESAPP_WEBHOOK_SECRET: !!process.env.NOTESAPP_WEBHOOK_SECRET,
    CRON_SECRET: !!process.env.CRON_SECRET,
    FIREBASE_SERVICE_ACCOUNT_JSON: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    NOTESAPP_API_BASE: process.env.NOTESAPP_API_BASE || null,
  };

  const checks = [
    { name: "Account (GET /v1/me)", scope: "any key", path: "/v1/me" },
    { name: "Posts", scope: "read:posts", path: "/v1/posts?limit=1" },
    { name: "Bookings", scope: "read:bookings", path: "/v1/bookings?limit=1" },
    { name: "Orders", scope: "read:orders", path: "/v1/orders?limit=1" },
    { name: "Earnings", scope: "read:earnings", path: "/v1/earnings?limit=1" },
  ];

  const results = key
    ? await Promise.all(
        checks.map(async (c) => {
          const r = await probe(c.path);
          const err = (r.body as ErrBody | null)?.error;
          return {
            ...c,
            body: r.body,
            ok: r.status >= 200 && r.status < 300,
            status: r.status,
            code: err?.code ?? null,
            message: err?.message ?? null,
          };
        })
      )
    : [];

  const account = results[0]?.ok ? results[0].body : null;

  return NextResponse.json({
    base: API_BASE,
    keyId: keyId ?? null,
    keyProblems,
    env,
    account,
    checks: results.map(({ body: _body, ...c }) => c),
  });
}
