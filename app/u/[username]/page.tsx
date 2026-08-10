import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserByUsername, getCommentsByUser } from "@/lib/users";
import { getAllNotes } from "@/lib/firestore-notes";

export const dynamic = "force-dynamic";

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

  const [comments, allNotes] = await Promise.all([
    getCommentsByUser(profile.uid, 10),
    profile.role === "admin" ? getAllNotes() : Promise.resolve([]),
  ]);

  const authoredNotes = allNotes.filter((n) => n.author === profile.displayName);
  const socialEntries = Object.entries(profile.social).filter(([, v]) => v);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-start gap-6 border-b-2 border-ink pb-8">
        <Image
          src={profile.avatar}
          alt={profile.displayName}
          width={96}
          height={96}
          className="rounded-full object-cover w-24 h-24 flex-shrink-0 border-2 border-gold"
        />
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl">{profile.displayName}</h1>
            {profile.role === "admin" && (
              <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 bg-gold/20 text-gold-deep">
                Precheks Team
              </span>
            )}
          </div>
          <p className="font-mono text-sm text-gold-deep mt-1">
            @{profile.username}
          </p>
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
        </div>
      </div>

      {authoredNotes.length > 0 && (
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

      <div className="mt-10">
        <p className="eyebrow">Recent Activity</p>
        {comments.length === 0 ? (
          <p className="mt-4 text-sm text-slate">No comments yet.</p>
        ) : (
          <div className="mt-5 divide-y divide-rule">
            {comments.map((c) => (
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
