import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUserByUsername, getCommentsByUser, SUSPENDED_AVATAR } from "@/lib/users";
import { getAllNotes } from "@/lib/firestore-notes";
import { getRecentCommentsOnNotes } from "@/lib/engagement";
import { PRODUCTS } from "@/lib/products";
import { EMMANUEL_BOOKS } from "@/lib/emmanuel-books";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getUserByUsername(params.username);
  if (!profile) return { title: "Profile Not Found" };

  const description = profile.suspended
    ? "This account is temporarily suspended."
    : profile.bio || `${profile.displayName}'s profile on Precheks.`;
  const ogImage = profile.suspended ? SUSPENDED_AVATAR : profile.avatar;

  return {
    title: `${profile.displayName} (@${profile.username})`,
    description,
    openGraph: {
      title: profile.displayName,
      description,
      type: "profile",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.displayName,
      description,
      images: [ogImage],
    },
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  whatsapp: "WhatsApp",
  website: "Website",
};

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getUserByUsername(params.username);
  if (!profile) return notFound();

  const isAuthor = profile.role === "admin" || profile.role === "writer";

  const [ownComments, allNotes] = await Promise.all([
    getCommentsByUser(profile.uid, 10).catch((err) => {
      console.error(`getCommentsByUser(${profile.uid}) failed:`, err);
      return [] as Awaited<ReturnType<typeof getCommentsByUser>>;
    }),
    isAuthor
      ? getAllNotes().catch((err) => {
          console.error("getAllNotes() failed on profile page:", err);
          return [] as Awaited<ReturnType<typeof getAllNotes>>;
        })
      : Promise.resolve([]),
  ]);

  const authoredNotes = allNotes.filter((n) => n.author === profile.displayName);

  // Authors: "activity" means comments people left on THEIR writing.
  // Readers: "activity" means comments they personally wrote elsewhere.
  const receivedComments = isAuthor
    ? await getRecentCommentsOnNotes(
        authoredNotes.map((n) => n.id),
        5,
        10
      ).catch((err) => {
        console.error("getRecentCommentsOnNotes failed:", err);
        return [] as Awaited<ReturnType<typeof getRecentCommentsOnNotes>>;
      })
    : [];

  const socialEntries = Object.entries(profile.social).filter(([, v]) => v);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-start gap-6 border-b-2 border-ink pb-8">
        <Image
          src={profile.suspended ? SUSPENDED_AVATAR : profile.avatar}
          alt={profile.displayName}
          width={96}
          height={96}
          className="rounded-full object-cover w-24 h-24 flex-shrink-0 border-2 border-gold"
        />
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl">{profile.displayName}</h1>
            {profile.suspended && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-red-100 text-red-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 1a5 5 0 015 5v3h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h1V6a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V6a3 3 0 00-3-3z" />
                </svg>
                Temporarily Suspended
              </span>
            )}
            {!profile.suspended && profile.role === "admin" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-gold/20 text-gold-deep">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.39 1.94 3.06-.37.72 3.02 2.78 1.45-1.09 2.91 1.09 2.91-2.78 1.45-.72 3.02-3.06-.37L12 20l-2.39-1.94-3.06.37-.72-3.02-2.78-1.45 1.09-2.91-1.09-2.91 2.78-1.45.72-3.02 3.06.37L12 2zm-1.05 13.31l5.34-5.34-1.06-1.06-4.28 4.28-2.12-2.12-1.06 1.06 3.18 3.18z" />
                </svg>
                Precheks Team
              </span>
            )}
            {!profile.suspended && profile.role === "writer" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-ink/10 text-ink">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                Contributing Writer
              </span>
            )}
          </div>
          <p className="font-mono text-sm text-gold-deep mt-1">
            @{profile.username}
          </p>
          {profile.suspended ? (
            <p className="mt-3 text-slate font-body max-w-md text-sm italic">
              This account is temporarily suspended for violating our terms
              of use. Their posts and comments are hidden until the
              suspension is lifted.
            </p>
          ) : (
            <>
              {profile.bio && (
                <p className="mt-3 text-slate font-body max-w-md">{profile.bio}</p>
              )}
              {socialEntries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {socialEntries.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink"
                >
                  {SOCIAL_LABELS[key] || key}
                </a>
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </div>

      {!profile.suspended && authoredNotes.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow">Posts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mt-5">
            {authoredNotes.map((n) => (
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
                <h4 className="headline-link text-lg mt-2">{n.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!profile.suspended && profile.username === "chimdinma" && (
        <div className="mt-10">
          <p className="eyebrow">Books &amp; Courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
            {PRODUCTS.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-rule bg-card hover:border-gold transition-colors"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-paper">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="33vw"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-display text-base group-hover:text-gold-deep leading-snug">
                    {p.title}
                  </h4>
                  <p className="mt-2 font-ui font-bold text-sm text-ink">
                    {p.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <a
            href="https://selar.com/m/precheks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink"
          >
            Browse full store →
          </a>
        </div>
      )}

      {!profile.suspended && profile.username === "emmanuel" && (
        <div className="mt-10">
          <p className="eyebrow">Books &amp; Publications</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
            {EMMANUEL_BOOKS.map((b) => (
              <a
                key={b.title}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-rule bg-card hover:border-gold transition-colors"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-paper">
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="33vw"
                  />
                  <span className="absolute top-3 left-3 bg-ink/80 text-paper font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5">
                    {b.type}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-display text-base group-hover:text-gold-deep leading-snug">
                    {b.title}
                  </h4>
                  {b.subtitle && (
                    <p className="mt-1 text-xs text-slate leading-snug">
                      {b.subtitle}
                    </p>
                  )}
                  <p
                    className={`mt-2 font-ui font-bold text-sm ${
                      b.price === "Free" ? "text-gold-deep" : "text-ink"
                    }`}
                  >
                    {b.price}
                  </p>
                  <span className="mt-2 inline-block font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep group-hover:text-ink transition-colors">
                    {b.price === "Free" ? "Read Free →" : "Buy on Amazon →"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <p className="eyebrow">
          {isAuthor ? "Recent Comments on Their Notes" : "Recent Activity"}
        </p>
        {profile.suspended ? (
          <p className="mt-4 text-sm text-slate italic">
            This account is temporarily suspended. Their comments are
            hidden until the suspension is lifted.
          </p>
        ) : isAuthor ? (
          receivedComments.length === 0 ? (
            <p className="mt-4 text-sm text-slate">No comments yet.</p>
          ) : (
            <div className="mt-5 divide-y divide-rule">
              {receivedComments.map((c) => (
                <div key={c.id} className="flex gap-3 py-4 first:pt-0">
                  <Link href={`/u/${c.authorUsername}`} className="flex-shrink-0">
                    <Image
                      src={c.authorAvatar}
                      alt={c.authorDisplayName}
                      width={36}
                      height={36}
                      className="rounded-full object-cover w-9 h-9"
                    />
                  </Link>
                  <div>
                    <p className="text-xs font-mono text-slate">
                      <Link
                        href={`/u/${c.authorUsername}`}
                        className="text-ink font-semibold hover:text-gold-deep"
                      >
                        {c.authorDisplayName}
                      </Link>{" "}
                      commented on{" "}
                      <Link
                        href={`/notes/${c.noteSlug}`}
                        className="text-gold-deep hover:text-ink"
                      >
                        {c.noteTitle}
                      </Link>
                    </p>
                    <p className="mt-1.5 text-sm text-ink font-body">
                      &ldquo;{c.content}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : ownComments.length === 0 ? (
          <p className="mt-4 text-sm text-slate">No comments yet.</p>
        ) : (
          <div className="mt-5 divide-y divide-rule">
            {ownComments.map((c) => (
              <Link
                key={c.id}
                href={`/notes/${c.noteSlug}`}
                className="block py-4 first:pt-0 group"
              >
                <p className="text-xs font-mono text-slate">
                  Commented on{" "}
                  <span className="text-gold-deep group-hover:text-ink">
                    {c.noteTitle}
                  </span>
                </p>
                <p className="mt-1.5 text-sm text-ink font-body">
                  &ldquo;{c.content}&rdquo;
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
