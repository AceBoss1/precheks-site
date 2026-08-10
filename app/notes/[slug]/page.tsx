import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getMoreNotes, getNoteBySlug } from "@/lib/notes";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const note = await getNoteBySlug(params.slug);
  if (!note) return notFound();
  const { meta, contentHtml } = note;
  const moreNotes = getMoreNotes(meta.slug, 4);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/notes"
        className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep"
      >
        ← All Notes
      </Link>
      <p className="eyebrow mt-6">{meta.categories[0] || "Notes"}</p>
      <h1 className="font-display text-4xl sm:text-5xl mt-3 leading-[1.05]">
        {meta.title}
      </h1>

      {/* Author row + reading time, same treatment as the homepage hero */}
      <div className="mt-6 flex items-center justify-between border-y border-rule py-4">
        <div className="flex items-center gap-3">
          <Image
            src={meta.author_avatar}
            alt={meta.author}
            width={44}
            height={44}
            className="rounded-full border-2 border-gold object-cover w-11 h-11 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-ui font-semibold text-ink">
              By {meta.author}
            </p>
            <p className="text-xs text-slate font-mono mt-0.5 uppercase tracking-wide">
              {meta.author_role}
            </p>
          </div>
        </div>
        <p className="font-mono text-xs text-slate whitespace-nowrap">
          {meta.date &&
            new Date(meta.date).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
          &nbsp;|&nbsp; {meta.reading_time} min read
        </p>
      </div>

      {meta.featured_image && (
        <Image
          src={meta.featured_image}
          alt={meta.title}
          width={900}
          height={520}
          className="w-full h-auto object-cover mt-8"
        />
      )}

      <div
        className="prose prose-lg max-w-none mt-10 font-body text-ink prose-headings:font-display prose-a:text-gold-deep"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {meta.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-rule flex flex-wrap gap-3">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] uppercase tracking-eyebrow text-slate"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* More / trending notes */}
      {moreNotes.length > 0 && (
        <div className="mt-16 pt-10 border-t-2 border-ink">
          <p className="eyebrow">More from Notes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mt-6">
            {moreNotes.map((n) => (
              <Link key={n.slug} href={`/notes/${n.slug}`} className="group">
                {n.featured_image && (
                  <Image
                    src={n.featured_image}
                    alt={n.title}
                    width={400}
                    height={260}
                    className="w-full h-40 object-cover"
                  />
                )}
                <p className="eyebrow mt-3">{n.categories[0] || "Notes"}</p>
                <h4 className="headline-link text-lg mt-1.5">{n.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}