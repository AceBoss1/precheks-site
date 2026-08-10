import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/firestore-notes";

const SERVICES = [
  {
    title: "1-to-1 Career Coaching",
    body: "A safe space to share academic and career challenges, and leave with clarity, information, and confidence to grow a rewarding career.",
  },
  {
    title: "Data Analytics Consulting",
    body: "Cloud and on-premises databases, data scraping and migration, dashboard creation, and business intelligence reports with actionable insight.",
  },
  {
    title: "Web & App Development",
    body: "Seamless, user-centric digital experiences that elevate your brand and keep you ahead in the digital game.",
  },
];

const TESTIMONIALS = [
  {
    name: "Gregory Chioma Elizabeth",
    role: "Career Coaching Client",
    image: "/images/testimonials/gregory-chioma-elizabeth.jpeg",
    quote:
      "That clarity session with you was all we needed to point us to where we should be in tech. My husband has finished his Advanced Excel and is now on Data Analysis. I tried out Basic Excel but lost interest on the way — lol. I am excited about UX/UI because I feel it will allow my creativity to gain wings.",
  },
  {
    name: "Phebe Ojo Ali",
    role: "Excel Training Client",
    image: "/images/testimonials/phebe-ojo-ali.jpeg",
    quote:
      "The class is totally worth it. I feel like a PRO now. Too cheap for the value gotten. Thanks so much.",
  },
  {
    name: "Stellamaris Udegbe",
    role: "Career Coaching Client",
    image: "/images/testimonials/stellamaris-udegbe.jpeg",
    quote:
      "I was so confused on the next step to follow when I saw a comment by Chimdinma Onwuegbu — with just one phone call, she brought clarity to me and got me thinking about a blend I never thought possible. This is me saying thank you for opening the walls I was holding myself in. I haven't gotten there yet, but once I'm clear on what to do, moving is swiftly done.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allNotes = await getAllNotes();
  const notes = allNotes.slice(0, 13);
  const [leadNote, ...restNotes] = notes;

  return (
    <>
      {/* HERO — even split: business statement / latest from Notes */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-5">
          {/* Business half */}
          <div className="lg:col-span-3 bg-ink text-paper px-6 sm:px-10 py-14 lg:py-20">
            <p className="eyebrow text-gold">Excellence Delivered</p>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Bespoke education &amp; IT consultancy,{" "}
              <span className="text-gold">tailored for you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-paper/80 font-body text-lg">
              Precheks is a career and educational hub for aspiring and
              practising professionals, and businesses of every kind — from
              1-to-1 coaching to data analytics and web development.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="bg-gold text-ink font-ui font-semibold px-6 py-3 hover:bg-paper transition-colors"
              >
                Explore Services
              </Link>
              <Link
                href="/contact"
                className="border border-paper/40 px-6 py-3 font-ui font-semibold hover:border-gold hover:text-gold transition-colors"
              >
                Book a Session
              </Link>
            </div>

            <Link
              href="/u/chimdinma"
              className="mt-12 flex items-center gap-4 border-t border-paper/15 pt-6 group"
            >
              <Image
                src="/images/headshots/chimdinma-onwuegbu-2-professional.jpeg"
                alt="Chimdinma Onwuegbu, Founder & Lead Consultant"
                width={48}
                height={48}
                className="rounded-full border-2 border-gold object-cover w-12 h-12 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-ui text-paper/70">
                  Led by{" "}
                  <span className="text-gold group-hover:text-paper transition-colors font-semibold">
                    Chimdinma Onwuegbu
                  </span>
                </p>
                <p className="text-xs text-paper/50 font-mono mt-0.5 uppercase tracking-wide">
                  Founder &amp; Lead Consultant
                </p>
              </div>
            </Link>
          </div>

          {/* Notes half */}
          <div className="lg:col-span-2 bg-paper px-6 sm:px-10 py-14 lg:py-20 flex flex-col">
            <p className="eyebrow">From the Notes</p>
            <div className="mt-6 flex-1 divide-y divide-rule">
              {notes.slice(0, 5).map((n, i) => (
                <Link
                  key={n.slug}
                  href={`/notes/${n.slug}`}
                  className="group flex items-start gap-4 py-4 first:pt-0"
                >
                  <span className="font-mono text-xs text-slate pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="headline-link text-lg">{n.title}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/notes"
              className="mt-6 font-ui text-sm font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink"
            >
              All Notes →
            </Link>
          </div>
        </div>
      </section>

      {/* DENSE HEADLINE GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
          <h2 className="font-display text-2xl">Latest Notes</h2>
          <Link
            href="/notes"
            className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink"
          >
            View all
          </Link>
        </div>

        {leadNote && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8 pb-10 border-b border-rule">
            <div className="lg:col-span-2">
              {leadNote.featured_image && (
                <Link href={`/notes/${leadNote.slug}`}>
                  <Image
                    src={leadNote.featured_image}
                    alt={leadNote.title}
                    width={900}
                    height={520}
                    className="w-full h-auto object-cover"
                  />
                </Link>
              )}
              <p className="eyebrow mt-4">
                {leadNote.categories[0] || "Notes"}
              </p>
              <Link href={`/notes/${leadNote.slug}`}>
                <h3 className="headline-link text-3xl mt-2">
                  {leadNote.title}
                </h3>
              </Link>
              <p className="mt-3 text-slate font-body">{leadNote.excerpt}</p>
            </div>
            <div className="divide-y divide-rule">
              {restNotes.slice(0, 6).map((n) => (
                <Link
                  key={n.slug}
                  href={`/notes/${n.slug}`}
                  className="group block py-4 first:pt-0"
                >
                  <p className="eyebrow">{n.categories[0] || "Notes"}</p>
                  <h4 className="headline-link text-lg mt-1.5">{n.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 mt-10">
          {restNotes.slice(6, 12).map((n) => (
            <Link key={n.slug} href={`/notes/${n.slug}`} className="group">
              {n.featured_image && (
                <Image
                  src={n.featured_image}
                  alt={n.title}
                  width={400}
                  height={260}
                  className="w-full h-44 object-cover"
                />
              )}
              <p className="eyebrow mt-3">{n.categories[0] || "Notes"}</p>
              <h4 className="headline-link text-lg mt-1.5">{n.title}</h4>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow text-gold">Our Integrated Services</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-8">
            {SERVICES.map((s) => (
              <div key={s.title} className="border-t border-gold pt-5">
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-3 text-paper/75 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/services"
            className="inline-block mt-10 border border-gold text-gold px-6 py-3 font-ui font-semibold hover:bg-gold hover:text-ink transition-colors"
          >
            See All Services
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="eyebrow">What Clients Say</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-card border border-rule p-6 flex flex-col">
              <Image
                src={t.image}
                alt={t.name}
                width={64}
                height={64}
                className="rounded-full object-cover w-16 h-16"
              />
              <p className="mt-4 text-slate italic font-body leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-rule pt-4">
                <p className="font-ui text-sm font-semibold text-ink">{t.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-gold-deep mt-0.5">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
