export const metadata = { title: "Shop — Precheks" };

// Add your real Selar.ng product links here. Each card links out to Selar
// for checkout — this site never handles payment or delivery.
const PRODUCTS: { title: string; description: string; href: string }[] = [
  {
    title: "MS Excel: Beginner to Advanced",
    description:
      "A complete course taking you from beginner to advanced Excel proficiency.",
    href: "https://selar.co/", // TODO: replace with the real product link
  },
];

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Digital Products</p>
      <h1 className="font-display text-5xl mt-3">Shop</h1>
      <p className="mt-6 text-lg text-slate font-body max-w-2xl">
        Our courses and digital products are sold through Selar — click
        through to purchase and receive instant access.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 border-t-2 border-ink pt-10">
        {PRODUCTS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-rule bg-card p-6 block hover:border-gold transition-colors"
          >
            <h3 className="font-display text-xl group-hover:text-gold-deep">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-slate">{p.description}</p>
            <span className="mt-4 inline-block font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep">
              View on Selar →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
