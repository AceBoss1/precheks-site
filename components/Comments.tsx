"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, UserProfile, SUSPENDED_AVATAR } from "@/lib/users";
import {
  getComments,
  addComment,
  deleteComment,
  hasLikedComment,
  toggleCommentLike,
  Comment,
} from "@/lib/engagement";
import { isAdminEmail } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";

function CommentRow({
  comment,
  noteId,
  user,
  canModerate,
  onReply,
  onDelete,
  replyOpen,
  replyBox,
  isReply,
  suspended,
}: {
  comment: Comment;
  noteId: string;
  user: User | null | undefined;
  canModerate: boolean;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  replyOpen: boolean;
  replyBox: React.ReactNode;
  isReply: boolean;
  suspended: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  useEffect(() => {
    if (user && !suspended) {
      hasLikedComment(noteId, comment.id, user.uid).then(setLiked);
    } else {
      setLiked(false);
    }
  }, [user, noteId, comment.id, suspended]);

  async function handleLike() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const nowLiked = await toggleCommentLike(noteId, comment.id, user.uid);
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
  }

  return (
    <div className={isReply ? "flex gap-3 py-4" : "flex gap-3 py-5 first:pt-0"}>
      <Link href={`/u/${comment.authorUsername}`} className="flex-shrink-0">
        <Image
          src={suspended ? SUSPENDED_AVATAR : comment.authorAvatar}
          alt={comment.authorDisplayName}
          width={isReply ? 32 : 40}
          height={isReply ? 32 : 40}
          className={`rounded-full object-cover ${isReply ? "w-8 h-8" : "w-10 h-10"}`}
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/u/${comment.authorUsername}`}
            className="font-ui text-sm font-semibold text-ink hover:text-gold-deep"
          >
            {comment.authorDisplayName}
          </Link>
          <Link
            href={`/u/${comment.authorUsername}`}
            className="font-mono text-xs text-gold-deep"
          >
            @{comment.authorUsername}
          </Link>
          {suspended && (
            <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-red-100 text-red-800">
              Suspended
            </span>
          )}
        </div>

        {suspended ? (
          <p className="mt-1 text-sm text-slate italic">
            This comment is from a temporarily suspended account.
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink font-body">{comment.content}</p>
        )}

        <div className="mt-2 flex items-center gap-4 text-xs font-ui">
          {!suspended && (
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? "text-gold-deep font-semibold" : "text-slate hover:text-gold-deep"
              }`}
            >
              <span>{liked ? "♥" : "♡"}</span>
              <span>{likeCount > 0 ? likeCount : ""}</span>
            </button>
          )}
          {!isReply && !suspended && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-slate hover:text-gold-deep transition-colors"
            >
              Reply
            </button>
          )}
          {(user?.uid === comment.authorUid || canModerate) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-700 hover:text-red-900 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {replyOpen && <div className="mt-3">{replyBox}</div>}
      </div>
    </div>
  );
}

export default function Comments({
  noteId,
  slug,
  title,
  noteAuthorUid,
}: {
  noteId: string;
  slug: string;
  title: string;
  noteAuthorUid?: string;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [suspendedUids, setSuspendedUids] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);

  async function load() {
    const loaded = await getComments(noteId);
    setComments(loaded);

    // Check suspension status of every unique commenter — done live
    // rather than trusting the denormalized authorAvatar/displayName
    // on the comment doc, since a suspension can happen after a
    // comment was posted and needs to reflect immediately.
    const uniqueUids = Array.from(new Set(loaded.map((c) => c.authorUid)));
    const results = await Promise.all(
      uniqueUids.map(async (uid) => {
        const p = await getUserByUid(uid).catch(() => null);
        return [uid, !!p?.suspended] as const;
      })
    );
    setSuspendedUids(new Set(results.filter(([, s]) => s).map(([uid]) => uid)));
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
    if (noteAuthorUid && noteAuthorUid !== user.uid) {
      await createNotification(
        noteAuthorUid,
        "comment_on_note",
        `${profile.displayName} commented on "${title}"`,
        `/notes/${slug}#comments`
      ).catch(() => {}); // notification failure shouldn't block the comment itself
    }
    setText("");
    await load();
    setPosting(false);
  }

  async function handleReplySubmit(parentId: string) {
    if (!user || !profile || !replyText.trim()) return;
    setPostingReply(true);
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
      replyText.trim(),
      parentId
    );
    const parent = comments.find((c) => c.id === parentId);
    if (parent && parent.authorUid !== user.uid) {
      await createNotification(
        parent.authorUid,
        "reply_to_comment",
        `${profile.displayName} replied to your comment on "${title}"`,
        `/notes/${slug}#comments`
      ).catch(() => {});
    }
    setReplyText("");
    setReplyingTo(null);
    await load();
    setPostingReply(false);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(noteId, commentId);
    load();
  }

  const canModerate = !!(user?.email && isAdminEmail(user.email));
  const topLevel = comments.filter((c) => !c.parentCommentId);
  const repliesFor = (id: string) =>
    comments.filter((c) => c.parentCommentId === id);

  return (
    <div id="comments" className="mt-16 pt-10 border-t-2 border-ink scroll-mt-6">
      <p className="eyebrow">
        Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {user && profile?.suspended ? (
        <p className="mt-6 text-sm text-slate italic">
          Your account is temporarily suspended and can't post comments
          right now.
        </p>
      ) : user && profile ? (
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
        {topLevel.map((c) => {
          const replies = repliesFor(c.id);
          const replyBox = (
            <div className="flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${c.authorDisplayName}…`}
                className="flex-1 border border-rule bg-card px-3 py-2 text-sm focus:border-gold outline-none"
              />
              <button
                onClick={() => handleReplySubmit(c.id)}
                disabled={postingReply || !replyText.trim()}
                className="bg-gold text-ink font-ui text-xs font-semibold px-4 py-2 hover:bg-gold-deep hover:text-paper transition-colors disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          );

          return (
            <div key={c.id}>
              <CommentRow
                comment={c}
                noteId={noteId}
                user={user}
                canModerate={canModerate}
                onReply={(id) =>
                  setReplyingTo(replyingTo === id ? null : id)
                }
                onDelete={handleDelete}
                replyOpen={replyingTo === c.id && !!user}
                replyBox={replyBox}
                isReply={false}
                suspended={suspendedUids.has(c.authorUid)}
              />
              {replies.length > 0 && (
                <div className="ml-11 pl-3 border-l-2 border-rule divide-y divide-rule">
                  {replies.map((r) => (
                    <CommentRow
                      key={r.id}
                      comment={r}
                      noteId={noteId}
                      user={user}
                      canModerate={canModerate}
                      onReply={() => {}}
                      onDelete={handleDelete}
                      replyOpen={false}
                      replyBox={null}
                      isReply={true}
                      suspended={suspendedUids.has(r.authorUid)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
