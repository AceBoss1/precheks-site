"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWriterAuth } from "@/lib/useWriterAuth";
import { getNoteById, Note } from "@/lib/firestore-notes";
import NoteForm from "@/components/NoteForm";

export default function EditWriterNotePage({
  params,
}: {
  params: { id: string };
}) {
  const { user, profile, loading } = useWriterAuth();
  const [note, setNote] = useState<Note | null | undefined>(undefined);

  useEffect(() => {
    if (profile) {
      getNoteById(params.id).then(setNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, params.id]);

  if (loading || !user || !profile || note === undefined) {
    return <div className="px-6 py-24 text-center text-slate">Loading…</div>;
  }

  if (note === null) {
    return (
      <div className="px-6 py-24 text-center text-slate">
        Note not found.{" "}
        <Link href="/write" className="text-gold-deep underline">
          Back to Your Notes
        </Link>
      </div>
    );
  }

  // Admins can see everything via /admin/notes, but a writer editing
  // through /write can only ever be here for their OWN note — this is
  // a UX guard; the real enforcement is firestore.rules, which would
  // reject the write anyway if this were somehow bypassed.
  if (note.authorUid !== profile.uid && profile.role !== "admin") {
    return (
      <div className="px-6 py-24 text-center text-slate">
        This note isn't yours to edit.{" "}
        <Link href="/write" className="text-gold-deep underline">
          Back to Your Notes
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/write"
        className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep"
      >
        ← Your Notes
      </Link>
      <h1 className="font-display text-4xl mt-4">Edit Note</h1>
      <div className="mt-8">
        <NoteForm
          noteId={note.id}
          initial={note}
          writerProfile={profile.role === "writer" ? profile : undefined}
          returnTo="/write"
        />
      </div>
    </section>
  );
}
