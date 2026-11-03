"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";

type Check = {
  name: string;
  scope: string;
  path: string;
  ok: boolean;
  status: number;
  code: string | null;
  message: string | null;
};

type Status = {
  base: string;
  keyId: string | null;
  keyProblems: string[];
  env: Record<string, boolean | string | null>;
  account: { username?: string; display_name?: string; plan?: string; payouts_ready?: boolean } | null;
  checks: Check[];
};

// What to do about each NotesApp error code.
const ADVICE: Record<string, string> = {
  api_not_enabled:
    "NotesApp says the account that owns this key doesn't have API access. API access is set per account: check that the key was created while signed in as @precheks (not @emmanuel or another account). If it was, create a new key now that access is on, update NOTESAPP_API_KEY in Vercel and redeploy.",
  invalid_key:
    "The key isn't recognised — it was revoked, mistyped or cut off. Create a new key in the NotesApp Console (signed in as @precheks), update NOTESAPP_API_KEY in Vercel and redeploy.",
  missing_scope:
    "The key works but lacks this permission. Create a new key with all five scopes (read:posts, write:posts, read:bookings, read:orders, read:earnings).",
  rate_limited: "Too many requests (120/min). Wait a minute and re-check.",
  not_configured: "NOTESAPP_API_KEY is not set in Vercel. Add it and redeploy.",
  uploads_unavailable:
    "Image uploads go to NotesApp's media storage through POST /v1/uploads, which the NotesApp deployment doesn't have yet. Deploy the NotesApp change that adds it.",
  network_error: "The server couldn't reach the NotesApp API at all.",
};

export default function AdminNotesAppPage() {
  const { user, loading } = useAdminAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    if (!user) return;
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/notesapp/status", {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || body.error || "Check failed");
      setStatus(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setChecking(false);
    }
  }, [user]);

  useEffect(() => {
    check();
  }, [check]);

  if (loading || !user) {
    return <div className="px-6 py-24 text-center text-slate">Loading…</div>;
  }

  const codes = Array.from(
    new Set((status?.checks || []).filter((c) => !c.ok && c.code).map((c) => c.code!))
  );
  const allOk = !!status && status.checks.length > 0 && status.checks.every((c) => c.ok);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between border-b-2 border-ink pb-4 flex-wrap gap-4">
        <div>
          <p className="eyebrow">Precheks Admin</p>
          <h1 className="font-display text-4xl mt-2">NotesApp Connection</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="border border-rule px-5 py-2.5 font-ui text-sm font-semibold hover:border-gold"
          >
            ← Dashboard
          </Link>
          <button
            onClick={check}
            disabled={checking}
            className="bg-gold text-ink font-ui font-semibold px-5 py-2.5 hover:bg-gold-deep hover:text-paper transition-colors disabled:opacity-50"
          >
            {checking ? "Checking…" : "Re-check"}
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}
      {!status && !error && <p className="mt-8 text-slate">Checking…</p>}

      {status && (
        <div className="mt-8 grid gap-10">
          <div
            className={`border p-5 ${allOk ? "border-green-700 bg-green-50" : "border-red-700 bg-red-50"}`}
          >
            <p className="font-ui font-semibold">
              {allOk
                ? `Connected as @${status.account?.username} (${status.account?.plan}).`
                : "The NotesApp connection isn't working yet."}
            </p>
            {codes.map((c) => (
              <p key={c} className="mt-2 text-sm">
                <span className="font-mono">{c}</span> — {ADVICE[c] || "See the message below."}
              </p>
            ))}
          </div>

          <div>
            <p className="eyebrow">Key in use</p>
            <dl className="mt-3 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-slate">API base</dt>
              <dd className="font-mono break-all">{status.base}</dd>
              <dt className="text-slate">Key id</dt>
              <dd className="font-mono break-all">
                {status.keyId || "—"}
                <span className="block text-xs text-slate font-body">
                  Match this against the keys listed in the NotesApp Console. Only the id is
                  shown, never the secret.
                </span>
              </dd>
              <dt className="text-slate">Key belongs to</dt>
              <dd className="font-mono">
                {status.account
                  ? `@${status.account.username} · ${status.account.plan}`
                  : "unknown (GET /v1/me failed)"}
              </dd>
            </dl>
            {status.keyProblems.map((p) => (
              <p key={p} className="mt-2 text-sm text-red-700">
                {p}
              </p>
            ))}
          </div>

          <div>
            <p className="eyebrow">API checks</p>
            <div className="mt-3 divide-y divide-rule border-y border-rule">
              {status.checks.map((c) => (
                <div key={c.path} className="py-3 flex gap-4 items-start">
                  <span className={`font-mono text-sm ${c.ok ? "text-green-700" : "text-red-700"}`}>
                    {c.ok ? "OK" : c.status || "ERR"}
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">
                      {c.name} <span className="font-mono text-slate">· {c.scope}</span>
                    </p>
                    {!c.ok && (
                      <p className="text-slate">
                        <span className="font-mono">{c.code}</span> {c.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Server settings (Vercel env vars)</p>
            <div className="mt-3 divide-y divide-rule border-y border-rule text-sm">
              {Object.entries(status.env).map(([k, v]) => (
                <p key={k} className="py-2 flex justify-between gap-4">
                  <span className="font-mono">{k}</span>
                  <span className={v ? "text-green-700" : "text-slate"}>
                    {typeof v === "string" ? v : v ? "set" : k === "NOTESAPP_API_BASE" ? "default" : "missing"}
                  </span>
                </p>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate">
              After changing an env var in Vercel, redeploy — running deployments keep the old value.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
