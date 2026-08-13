"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllNotes, NoteWithComputed } from "@/lib/firestore-notes";
import { getAllUsers, UserProfile } from "@/lib/users";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<NoteWithComputed[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllNotes(), getAllUsers()])
      .then(([n, u]) => {
        setNotes(n);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();

  const matchedNotes = useMemo(() => {
    if (!q) return [];
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.categories.some((c) => c.toLowerCase().includes(q)) ||
        n.tags.some((t) => t.toLowerCase().includes(q)) ||
        n.author.toLowerCase().includes(q)
    );
  }, [q, notes]);

  const matchedUsers = useMemo(() => {
    if (!q) return [];
    return users.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
    );
  }, [q, users]);

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Search Precheks</p>
      <h1 className="font-display text-5xl mt-3">Search</h1>
      <p className="mt-3 text-slate font-body">
        Find Notes by title, category, or author — or find writers and
        readers by name.
      </p>

      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search notes, writers, or readers…"
        className="mt-8 w-full border-2 border-ink bg-card px-5 py-4 font-body text-lg focus:border-gold outline-none"
      />

      {loading && <p className="mt-8 text-slate">Loading…</p>}

      {!loading && q && (
        <>
          <div className="mt-10">
            <p className="eyebrow">
              Notes {matchedNotes.length > 0 && `(${matchedNotes.length})`}
            </p>
            {matchedNotes.length === 0 ? (
              <p className="mt-3 text-sm text-slate">No matching notes.</p>
            ) : (
              <div className="mt-4 divide-y divide-rule">
                {matchedNotes.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/notes/${n.slug}`}
                    className="flex items-center gap-4 py-4 first:pt-0 group"
                  >
                    {n.featured_image && (
                      <Image
                        src={n.featured_image}
                        alt={n.title}
                        width={80}
                        height={56}
                        className="w-20 h-14 object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="eyebrow">{n.categories[0] || "Notes"}</p>
                      <h3 className="headline-link text-lg mt-1">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate mt-0.5">
                        By {n.author}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10">
            <p className="eyebrow">
              People {matchedUsers.length > 0 && `(${matchedUsers.length})`}
            </p>
            {matchedUsers.length === 0 ? (
              <p className="mt-3 text-sm text-slate">No matching people.</p>
            ) : (
              <div className="mt-4 divide-y divide-rule">
                {matchedUsers.map((u) => (
                  <Link
                    key={u.uid}
                    href={`/u/${u.username}`}
                    className="flex items-center gap-4 py-4 first:pt-0 group"
                  >
                    <Image
                      src={u.avatar}
                      alt={u.displayName}
                      width={44}
                      height={44}
                      className="rounded-full object-cover w-11 h-11 flex-shrink-0"
                    />
                    <div>
                      <p className="font-ui font-semibold text-ink group-hover:text-gold-deep">
                        {u.displayName}{" "}
                        <span className="font-mono text-xs text-gold-deep">
                          @{u.username}
                        </span>
                      </p>
                      {u.bio && (
                        <p className="text-xs text-slate mt-0.5">{u.bio}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
