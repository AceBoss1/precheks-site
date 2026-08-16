"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";
import { getUserByUid, UserProfile } from "./users";

export function useWriterAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null | undefined>(
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setProfile(null);
        router.replace("/login");
        return;
      }
      setUser(u);
      const p = await getUserByUid(u.uid);
      if (!p || (p.role !== "writer" && p.role !== "admin")) {
        // signed in, but not a contributing writer (or admin) —
        // this area isn't for them
        setProfile(null);
        router.replace("/");
        return;
      }
      if (p.suspended) {
        // a suspended writer keeps their account but loses write access
        setProfile(null);
        router.replace("/");
        return;
      }
      setProfile(p);
    });
    return unsub;
  }, [router]);

  return { user, profile, loading: profile === undefined };
}
