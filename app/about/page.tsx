import Image from "next/image";

export const metadata = { title: "About — Precheks" };

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
  },
  {
    name: "Emmanuel Adams",
    role: "Consultant / Business Development Lead",
    image: "/images/headshots/emmanuel-adams-1.jpeg",
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
            <div key={member.name} className="flex items-center gap-4">
              <Image
                src={member.image}
                alt={member.name}
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
              <div>
                <p className="font-ui font-semibold text-ink">
                  {member.name}
                </p>
                <p className="text-sm text-slate">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
