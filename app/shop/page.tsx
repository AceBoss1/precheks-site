export const metadata = { title: "Shop — Precheks" };

const PRODUCTS = [
  {
    title: "20 IT Niches to Explore (With or Without a University Degree)",
    description:
      "A free downloadable guide mapping out 20 career-ready IT niches you can enter regardless of your academic background. Perfect if you're exploring where to start or pivot in tech.",
    price: "Free",
    type: "Downloadable",
    href: "https://selar.com/78101t",
    featured: false,
  },
  {
    title: "MS-Excel — Beginner to Advanced Proficiency",
    description:
      "A comprehensive physical course taking you from complete beginner to advanced Excel proficiency. Covers formulas, pivot tables, data analysis, dashboards, and real-world business applications.",
    price: "$29.49",
    originalPrice: "$47.92",
    type: "Physical Course",
    href: "https://selar.com/89u90q",
    featured: true,
  },
  {
    title: "Career Planning and Development",
    description:
      "A practical downloadable resource for professionals at any stage — whether you're just starting out, pivoting, or looking to level up. Covers goal-setting, skill mapping, and building a career you're proud of.",
    price: "$8",
    originalPrice: "$12",
    type: "Downloadable",
    href: "https://selar.com/208003",
    featured: false,
  },
];

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Digital Products &amp; Courses</p>
      <h1 className="font-display text-5xl mt-3">Shop</h1>
      <p className="mt-6 text-lg text-slate font-body max-w-2xl">
        Our courses and digital products are sold through Selar — click any
        card to purchase and receive instant access.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 border-t-2 border-ink pt-10">
        {PRODUCTS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex flex-col border bg-card p-6 hover:border-gold transition-colors ${
              p.featured ? "border-gold" : "border-rule"
            }`}
          >
            {/* Type badge */}
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-slate">
              {p.type}
            </span>

            {/* Featured label */}
            {p.featured && (
              <span className="mt-2 self-start bg-gold text-ink text-[10px] font-ui font-semibold uppercase tracking-wide px-2 py-0.5">
                Best Seller
              </span>
            )}

            <h3 className="font-display text-xl mt-3 group-hover:text-gold-deep leading-snug">
              {p.title}
            </h3>

            <p className="mt-3 text-sm text-slate leading-relaxed flex-1">
              {p.description}
            </p>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-2">
              <span
                className={`font-ui font-bold text-lg ${
                  p.price === "Free" ? "text-gold-deep" : "text-ink"
                }`}
              >
                {p.price}
              </span>
              {p.originalPrice && (
                <span className="font-ui text-sm text-slate line-through">
                  {p.originalPrice}
                </span>
              )}
            </div>

            <span className="mt-4 inline-block font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep group-hover:text-ink transition-colors">
              {p.price === "Free" ? "Download Free →" : "Buy on Selar →"}
            </span>
          </a>
        ))}
      </div>

      {/* Store link */}
      <p className="mt-10 text-sm text-slate font-body">
        Browse the full store at{" "}
        <a
          href="https://selar.com/m/precheks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-deep hover:text-ink underline underline-offset-2 transition-colors"
        >
          selar.com/m/precheks
        </a>
      </p>
    </section>
  );
}
