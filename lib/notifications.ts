import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type NotificationType =
  | "comment_on_note"
  | "reply_to_comment"
  | "account_suspended"
  | "account_restored"
  | "promoted_to_writer"
  | "removed_as_writer";

export type Notification = {
  id: string;
  recipientUid: string;
  type: NotificationType;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

const COLLECTION = "notifications";

export async function createNotification(
  recipientUid: string,
  type: NotificationType,
  message: string,
  link: string
): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    recipientUid,
    type,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export async function getNotifications(
  uid: string,
  max = 20
): Promise<Notification[]> {
  // No orderBy combined with the where() here — same pattern used
  // elsewhere in this app to avoid needing a composite index. Sort
  // client-side instead.
  const q = query(collection(db, COLLECTION), where("recipientUid", "==", uid));
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, max);
}

export async function getUnreadCount(uid: string): Promise<number> {
  // Deliberately a single where() clause — combining a second
  // equality filter risks needing a new composite index. Fetch by
  // recipient only (cheap at this scale) and filter client-side.
  const q = query(collection(db, COLLECTION), where("recipientUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.filter((d) => d.data().read === false).length;
}

export async function markAsRead(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { read: true });
}

export async function markAllAsRead(uid: string): Promise<void> {
  const q = query(collection(db, COLLECTION), where("recipientUid", "==", uid));
  const snap = await getDocs(q);
  const unread = snap.docs.filter((d) => d.data().read === false);
  if (unread.length === 0) return;
  const batch = writeBatch(db);
  unread.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}
