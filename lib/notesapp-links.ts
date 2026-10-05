// Booking and subscription happen on NotesApp (payment and sign-in live
// there). `from` lets NotesApp send visitors back to our domain afterwards.
const PROFILE = "https://www.notesapp.name.ng/u/precheks?from=notes.precheks.com.ng";

export const NOTESAPP_BOOK_URL = `${PROFILE}#book`;
export const NOTESAPP_SUBSCRIBE_URL = `${PROFILE}#subscribe`;
