"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebase";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) router.replace("/admin/login");
    });
    return unsub;
  }, [router]);

  return { user, loading: user === undefined };
}
