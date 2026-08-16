"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useWriterAuth } from "@/lib/useWriterAuth";
import {
  getNotesByAuthorUid,
  deleteNote,
  NoteWithComputed,
} from "@/lib/firestore-notes";

export default function WriteDashboard() {
  const { user, profile, loading } = useWriterAuth();
  const [notes, setNotes] = useState<NoteWithComputed[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    if (!profile) return;
    try {
      setNotes(await getNotesByAuthorUid(profile.uid));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your notes");
    }
  }

  useEffect(() => {
    if (profile) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deleteNote(id);
    load();
  }

  if (loading || !user || !profile) {
    return <div className="px-6 py-24 text-center text-slate">Loading…</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-center justify-between border-b-2 border-ink pb-4 flex-wrap gap-4">
        <div>
          <p className="eyebrow">Contributing Writer</p>
          <h1 className="font-display text-4xl mt-2">
            Your Notes, {profile.displayName.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/write/new"
            className="bg-gold text-ink font-ui font-semibold px-5 py-2.5 hover:bg-gold-deep hover:text-paper transition-colors"
          >
            + New Note
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="border border-rule px-5 py-2.5 font-ui text-sm hover:border-gold"
          >
            Sign Out
          </button>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {!notes ? (
        <p className="mt-8 text-slate">Loading your notes…</p>
      ) : notes.length === 0 ? (
        <p className="mt-8 text-slate">
          You haven't published anything yet.{" "}
          <Link href="/write/new" className="text-gold-deep underline">
            Write your first note →
          </Link>
        </p>
      ) : (
        <div className="mt-8 divide-y divide-rule">
          {notes.map((n) => (
            <div key={n.id} className="flex items-center justify-between py-4">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 ${
                      n.status === "published"
                        ? "bg-gold/20 text-gold-deep"
                        : "bg-slate/10 text-slate"
                    }`}
                  >
                    {n.status}
                  </span>
                  <p className="font-ui font-semibold text-ink">{n.title}</p>
                </div>
                <p className="text-xs text-slate mt-1 font-mono">
                  /{n.slug} · 👁 {n.viewCount || 0} · ♥ {n.likeCount || 0}
                </p>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                <Link
                  href={`/write/${n.id}/edit`}
                  className="font-ui text-sm font-semibold text-gold-deep hover:text-ink"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(n.id, n.title)}
                  className="font-ui text-sm font-semibold text-red-700 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
