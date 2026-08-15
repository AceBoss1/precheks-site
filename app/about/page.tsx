import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Meet the Precheks team — Chimdinma Onwuegbu and Emmanuel Adams — and our mission to deliver excellence in career coaching, data consulting, and IT services.",
  openGraph: {
    title: "About Precheks",
    description:
      "Meet the Precheks team and our mission to deliver excellence in career coaching, data consulting, and IT services.",
    images: ["/images/brand/og-default.jpg"],
  },
};

const VALUES = [
  {
    name: "Excellence",
    body: "Whatever is worth doing is worth doing not just well, but with a mark of excellence.",
  },
  {
    name: "Faith",
    body: "You can be the best version of you, and we have faith in ourselves to make it happen.",
  },
  {
    name: "Commitment",
    body: "Committed to learning and growing, improving the scope and quality of our services, so that only excellence is delivered.",
  },
];

const TEAM = [
  {
    name: "Chimdinma Onwuegbu",
    role: "Founder / Lead Consultant",
    image: "/images/headshots/chimdinma-onwuegbu-2-professional.jpeg",
    linkedin: "https://www.linkedin.com/in/chimdinma-onwuegbu",
    username: "chimdinma",
  },
  {
    name: "Emmanuel Adams",
    role: "Consultant / Business Development Lead",
    image: "/images/headshots/emmanuel-adams-1.jpeg",
    linkedin: "https://www.linkedin.com/in/emmanuel-adams-27891354/",
    username: "emmanuel",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Excellence Delivered</p>
      <h1 className="font-display text-5xl mt-3">About Precheks</h1>
      <p className="mt-6 text-lg text-slate font-body">
        Precheks is a career and educational hub for aspiring and practising
        professionals, as well as businesses of all kinds.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 border-t border-rule pt-10">
        <div>
          <p className="eyebrow">Mission</p>
          <p className="mt-3 font-body text-ink">
            To build a credible relationship with individuals who seek
            clarity on how to achieve their goals at any point in their
            career or business, helping them be the best they can be.
          </p>
        </div>
        <div>
          <p className="eyebrow">Vision</p>
          <p className="mt-3 font-body text-ink">
            To be an industry leader in providing students, aspiring, and
            practising professionals, as well as businesses, with
            person-centred career guidance and bespoke IT consultancy
            services.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="eyebrow">Our Values</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-5">
          {VALUES.map((v) => (
            <div key={v.name} className="border-t-2 border-gold pt-4">
              <h3 className="font-display text-xl">{v.name}</h3>
              <p className="mt-2 text-sm text-slate">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <p className="eyebrow">Dedicated Team for You</p>
        <p className="mt-3 text-slate font-body">
          My team and I are ever willing to provide any of these services to
          you, and be rest assured that you&apos;re getting nothing but the
          very best.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {TEAM.map((member) => (
            <div key={member.name} className="flex items-start gap-5 border border-rule p-5">
              <Link href={`/u/${member.username}`} className="flex-shrink-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-20 h-20"
                />
              </Link>
              <div>
                <Link href={`/u/${member.username}`}>
                  <p className="font-ui font-semibold text-ink text-base hover:text-gold-deep transition-colors">
                    {member.name}
                  </p>
                </Link>
                <p className="text-xs font-mono uppercase tracking-wide text-gold-deep mt-0.5">
                  {member.role}
                </p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-ui font-semibold text-slate hover:text-gold-deep transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
