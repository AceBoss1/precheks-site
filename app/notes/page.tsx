import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";

export const metadata = { title: "Notes — Precheks" };

export default function NotesPage() {
  const notes = getAllNotes();
  const allCategories = Array.from(
    new Set(notes.flatMap((n) => n.categories))
  ).slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Precheks Journal</p>
      <h1 className="font-display text-5xl mt-3">Notes</h1>
      <p className="mt-3 max-w-2xl text-slate font-body text-lg">
        Career clarity, data skills, and getting work right — writing from
        the Precheks team.
      </p>

      {allCategories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3 border-y border-rule py-4">
          {allCategories.map((c) => (
            <span
              key={c}
              className="font-ui text-xs font-semibold uppercase tracking-wideish text-slate"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-10">
        {notes.map((n) => (
          <Link key={n.slug} href={`/notes/${n.slug}`} className="group">
            {n.featured_image && (
              <Image
                src={n.featured_image}
                alt={n.title}
                width={400}
                height={260}
                className="w-full h-48 object-cover"
              />
            )}
            <p className="eyebrow mt-3">{n.categories[0] || "Notes"}</p>
            <h3 className="headline-link text-xl mt-1.5">{n.title}</h3>
            <p className="mt-2 text-sm text-slate">{n.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
