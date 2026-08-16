"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserByUid, UserProfile } from "@/lib/users";

export default function AuthNav() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setProfile(u ? await getUserByUid(u.uid) : null);
    });
  }, []);

  if (user === undefined) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-ink hover:text-gold-deep">
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-ink text-paper px-4 py-1.5 hover:bg-gold-deep transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {profile?.role === "writer" && !profile.suspended && (
        <Link href="/write" className="text-ink hover:text-gold-deep">
          Write
        </Link>
      )}
      {profile && (
        <Link
          href={`/u/${profile.username}`}
          className="font-mono text-gold-deep"
        >
          @{profile.username}
        </Link>
      )}
      <button
        onClick={() => signOut(auth)}
        className="text-ink hover:text-gold-deep normal-case font-ui text-xs"
      >
        Sign Out
      </button>
    </div>
  );
}
