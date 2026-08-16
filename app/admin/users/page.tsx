"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminAuth } from "@/lib/useAdminAuth";
import {
  getAllUsers,
  suspendUser,
  unsuspendUser,
  promoteToWriter,
  demoteToReader,
  UserProfile,
  SUSPENDED_AVATAR,
} from "@/lib/users";

export default function AdminUsersPage() {
  const { user, loading } = useAdminAuth();
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState("");
  const [suspendingUid, setSuspendingUid] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setUsers(await getAllUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function handleSuspend(uid: string) {
    if (!reason.trim()) return;
    setBusy(true);
    await suspendUser(uid, reason.trim());
    setSuspendingUid(null);
    setReason("");
    setBusy(false);
    load();
  }

  async function handleUnsuspend(uid: string, name: string) {
    if (!confirm(`Restore ${name}'s account? Their profile, posts, and comments will show normally again.`)) return;
    await unsuspendUser(uid);
    load();
  }

  async function handlePromote(uid: string, name: string) {
    if (!confirm(`Make ${name} a contributing writer? They'll be able to publish their own notes.`)) return;
    await promoteToWriter(uid);
    load();
  }

  async function handleDemote(uid: string, name: string) {
    if (!confirm(`Remove ${name}'s writer access? Their published notes stay live, but they can no longer create new ones.`)) return;
    await demoteToReader(uid);
    load();
  }

  if (loading || !user) {
    return <div className="px-6 py-24 text-center text-slate">Loading…</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/admin"
        className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep"
      >
        ← Dashboard
      </Link>
      <p className="eyebrow mt-6">
        {users ? `${users.length} Registered` : ""}
      </p>
      <h1 className="font-display text-4xl mt-3">Users</h1>
      <p className="mt-3 text-sm text-slate max-w-xl">
        Everyone who's signed up to comment or like on the site, plus the
        two Precheks Team accounts. Promote a reader to Contributing Writer
        to let them publish their own Notes — unlike Team accounts,
        writers can be suspended for spam or terms violations, which
        hides their posts and comments behind a suspended notice until
        restored. To add or remove a Team (admin) account, do that
        directly in Firebase Authentication and update lib/admin.ts +
        firestore.rules.
      </p>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {!users ? (
        <p className="mt-8 text-slate">Loading…</p>
      ) : (
        <div className="mt-8 divide-y divide-rule">
          {users.map((u) => (
            <div key={u.uid} className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link href={`/u/${u.username}`} className="flex items-center gap-3 group">
                  <Image
                    src={u.suspended ? SUSPENDED_AVATAR : u.avatar}
                    alt={u.displayName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                  />
                  <div>
                    <p className="font-ui font-semibold text-ink group-hover:text-gold-deep">
                      {u.displayName}{" "}
                      <span className="font-mono text-xs text-gold-deep">
                        @{u.username}
                      </span>
                    </p>
                    <p className="text-xs text-slate mt-0.5">{u.email}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 ${
                          u.role === "admin"
                            ? "bg-gold/20 text-gold-deep"
                            : u.role === "writer"
                              ? "bg-ink/10 text-ink"
                              : "bg-slate/10 text-slate"
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.suspended && (
                        <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-red-100 text-red-800">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate mt-1 font-mono">
                      {new Date(u.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {u.role === "admin" ? (
                    <span className="text-xs text-slate italic">
                      Team accounts can't be suspended here
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {u.role === "reader" ? (
                        <button
                          onClick={() => handlePromote(u.uid, u.displayName)}
                          className="font-ui text-xs font-semibold uppercase tracking-wideish text-ink hover:text-gold-deep border border-rule px-3 py-1.5 hover:border-gold"
                        >
                          Make Writer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDemote(u.uid, u.displayName)}
                          className="font-ui text-xs font-semibold uppercase tracking-wideish text-slate hover:text-ink border border-rule px-3 py-1.5 hover:border-gold"
                        >
                          Remove Writer
                        </button>
                      )}
                      {u.suspended ? (
                        <button
                          onClick={() => handleUnsuspend(u.uid, u.displayName)}
                          className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink border border-rule px-3 py-1.5 hover:border-gold"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => setSuspendingUid(u.uid)}
                          className="font-ui text-xs font-semibold uppercase tracking-wideish text-red-700 hover:text-red-900 border border-rule px-3 py-1.5 hover:border-red-300"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {u.suspended && u.suspendedReason && (
                <p className="mt-2 text-xs text-slate italic pl-13">
                  Reason: {u.suspendedReason}
                </p>
              )}

              {suspendingUid === u.uid && (
                <div className="mt-3 flex items-center gap-2 border border-rule p-3">
                  <input
                    autoFocus
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for suspension (e.g. spam, abusive comments)…"
                    className="flex-1 border border-rule bg-card px-3 py-2 text-sm focus:border-gold outline-none"
                  />
                  <button
                    onClick={() => handleSuspend(u.uid)}
                    disabled={busy || !reason.trim()}
                    className="bg-red-700 text-paper font-ui text-xs font-semibold px-4 py-2 hover:bg-red-900 transition-colors disabled:opacity-50"
                  >
                    {busy ? "Suspending…" : "Confirm Suspend"}
                  </button>
                  <button
                    onClick={() => {
                      setSuspendingUid(null);
                      setReason("");
                    }}
                    className="text-xs text-slate hover:text-ink px-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
