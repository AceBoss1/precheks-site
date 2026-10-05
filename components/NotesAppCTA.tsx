import { NOTESAPP_BOOK_URL, NOTESAPP_SUBSCRIBE_URL } from "@/lib/notesapp-links";

export default function NotesAppCTA({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={NOTESAPP_BOOK_URL}
        className="bg-gold text-ink font-ui font-semibold px-6 py-3 hover:bg-gold-deep hover:text-paper transition-colors"
      >
        Book a Session
      </a>
      <a
        href={NOTESAPP_SUBSCRIBE_URL}
        className="border border-ink font-ui font-semibold px-6 py-3 hover:border-gold hover:text-gold-deep transition-colors"
      >
        Subscribe
      </a>
    </div>
  );
}
