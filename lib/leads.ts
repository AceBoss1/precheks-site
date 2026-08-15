import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export type LeadStatus = "new" | "contacted" | "converted";

export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

const COLLECTION = "leads";

export async function createLead(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    status: "new" as LeadStatus,
    createdAt: new Date().toISOString(),
  });
}

export async function getAllLeads(): Promise<Lead[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead));
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status });
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
