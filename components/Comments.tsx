"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, UserProfile } from "@/lib/users";
import { getComments, addComment, deleteComment, Comment } from "@/lib/engagement";
import { isAdminEmail } from "@/lib/admin";

export default function Comments({
  noteId,
  slug,
  title,
}: {
  noteId: string;
  slug: string;
  title: string;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  async function load() {
    setComments(await getComments(noteId));
  }

  useEffect(() => {
    load();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setProfile(u ? await getUserByUid(u.uid) : null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile || !text.trim()) return;
    setPosting(true);
    await addComment(
      noteId,
      slug,
      title,
      {
        uid: user.uid,
        username: profile.username,
        displayName: profile.displayName,
        avatar: profile.avatar,
      },
      text.trim()
    );
    setText("");
    await load();
    setPosting(false);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(noteId, commentId);
    load();
  }

  const canModerate = user?.email && isAdminEmail(user.email);

  return (
    <div className="mt-16 pt-10 border-t-2 border-ink">
      <p className="eyebrow">
        Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {user && profile ? (
        <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
          <Image
            src={profile.avatar}
            alt={profile.displayName}
            width={40}
            height={40}
            className="rounded-full object-cover w-10 h-10 flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts…"
              className="w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
            />
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="mt-2 bg-gold text-ink font-ui text-sm font-semibold px-5 py-2 hover:bg-gold-deep hover:text-paper transition-colors disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </form>
      ) : user === null ? (
        <p className="mt-6 text-sm text-slate">
          <Link href="/login" className="text-gold-deep font-semibold">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      ) : null}

      <div className="mt-8 divide-y divide-rule">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 py-5 first:pt-0">
            <Link href={`/u/${c.authorUsername}`}>
              <Image
                src={c.authorAvatar}
                alt={c.authorDisplayName}
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10 flex-shrink-0"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/u/${c.authorUsername}`}
                  className="font-ui text-sm font-semibold text-ink hover:text-gold-deep"
                >
                  {c.authorDisplayName}
                </Link>
                <Link
                  href={`/u/${c.authorUsername}`}
                  className="font-mono text-xs text-gold-deep"
                >
                  @{c.authorUsername}
                </Link>
              </div>
              <p className="mt-1 text-sm text-ink font-body">{c.content}</p>
              {(user?.uid === c.authorUid || canModerate) && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="mt-1 text-xs text-red-700 hover:text-red-900"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
