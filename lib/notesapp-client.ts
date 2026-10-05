import { auth } from "./firebase";
import { isAdminEmail } from "./admin";

// Browser-side helper: asks our own server route to push a saved note to
// NotesApp. Best-effort — never throws, so saving a note is never blocked.
export async function syncNoteToNotesApp(noteId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || !isAdminEmail(user.email)) return;
  try {
    const res = await fetch("/api/notesapp/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({ noteId }),
    });
    if (!res.ok) console.warn("NotesApp sync failed:", await res.text());
  } catch (err) {
    console.warn("NotesApp sync failed:", err);
  }
}
