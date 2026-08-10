import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getNoteBySlug } from "@/lib/notes";

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
      {meta.date && (
        <p className="mt-4 font-mono text-xs uppercase tracking-eyebrow text-slate">
          {new Date(meta.date).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

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
    </article>
  );
}
