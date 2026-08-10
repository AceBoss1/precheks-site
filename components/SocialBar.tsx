"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  incrementViewCount,
  incrementShareCount,
  hasLiked,
  toggleLike,
} from "@/lib/engagement";

export default function SocialBar({
  noteId,
  slug,
  title,
  initialViewCount,
  initialLikeCount,
  initialShareCount,
}: {
  noteId: string;
  slug: string;
  title: string;
  initialViewCount: number;
  initialLikeCount: number;
  initialShareCount: number;
}) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [copied, setCopied] = useState(false);

  // count a view once per browser session per note
  useEffect(() => {
    const key = `viewed:${noteId}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      incrementViewCount(noteId);
      setViewCount((v) => v + 1);
    }
  }, [noteId]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setUid(user?.uid || null);
      if (user) setLiked(await hasLiked(noteId, user.uid));
    });
  }, [noteId]);

  async function handleLike() {
    if (!uid) {
      router.push("/login");
      return;
    }
    const nowLiked = await toggleLike(noteId, uid);
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
  }

  async function handleShare() {
    const url = `${window.location.origin}/notes/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        return; // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    await incrementShareCount(noteId);
    setShareCount((c) => c + 1);
  }

  return (
    <div className="flex items-center gap-6 py-4 border-y border-rule font-ui text-sm">
      <button
        onClick={handleLike}
        className={`flex items-center gap-1.5 transition-colors ${
          liked ? "text-gold-deep" : "text-slate hover:text-gold-deep"
        }`}
      >
        <span>{liked ? "♥" : "♡"}</span>
        <span>{likeCount}</span>
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-slate hover:text-gold-deep transition-colors"
      >
        <span>↗</span>
        <span>{copied ? "Link copied" : shareCount}</span>
      </button>
      <span className="flex items-center gap-1.5 text-slate">
        <span>👁</span>
        <span>{viewCount} views</span>
      </span>
    </div>
  );
}
