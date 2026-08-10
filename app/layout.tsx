import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Precheks — Excellence Delivered",
  description:
    "Data, career, and business consulting from Precheks — plus Notes, our journal on skills, careers, and getting work right.",
  icons: { icon: "/images/brand/favicon-icon.png" },
};

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/notes",    label: "Notes"    },
  { href: "/about",    label: "About"    },
  { href: "/shop",     label: "Shop"     },
  { href: "/contact",  label: "Contact"  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Barlow+Condensed:wght@500;600;700&family=Archivo:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Time-based greeting — runs on the visitor's device, no server clock */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  function greeting(){
    var h = new Date().getHours();
    if(h >= 5  && h < 12) return "Good morning";
    if(h >= 12 && h < 17) return "Good afternoon";
    if(h >= 17 && h < 21) return "Good evening";
    return "Good night";
  }
  document.addEventListener("DOMContentLoaded", function(){
    var el = document.getElementById("precheks-greeting");
    if(el) el.textContent = greeting();
  });
})();
`,
          }}
        />
      </head>
      <body>
        {/* Masthead */}
        <header className="border-b-2 border-ink">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Top bar */}
            <div className="flex items-center justify-between py-2 text-[11px] font-mono text-slate border-b border-rule">
              <span>{today}</span>
              {/* Greeting — populated client-side so it reflects the visitor's local time */}
              <span
                id="precheks-greeting"
                className="hidden sm:inline"
                aria-live="polite"
              >
                {/* default shown before JS runs; immediately replaced */}
                Welcome
              </span>
            </div>

            {/* Logo + nav */}
            <div className="flex flex-col items-center gap-3 py-6 sm:flex-row sm:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/brand/favicon-icon.png"
                  alt="Precheks"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <span className="font-display text-3xl tracking-tight text-ink">
                  Precheks
                </span>
              </Link>
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-ui text-sm font-semibold uppercase tracking-wideish">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-ink hover:text-gold-deep transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div className="h-[3px] bg-gold" />
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer className="mt-24 border-t-2 border-ink bg-ink text-paper">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 gap-10 sm:grid-cols-3">

            {/* Brand */}
            <div>
              <span className="font-display text-2xl">Precheks</span>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-gold">
                Excellence Delivered
              </p>
              <p className="mt-4 text-sm text-paper/70 max-w-xs">
                Data, career, and business consulting — plus Notes, our
                journal on skills, careers, and getting work right.
              </p>
            </div>

            {/* Explore links */}
            <div>
              <p className="eyebrow text-gold">Explore</p>
              <ul className="mt-4 space-y-2 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-gold">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect with us */}
            <div>
              <p className="eyebrow text-gold">Connect With Us</p>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                <li>
                  <a
                    href="mailto:info@precheks.com.ng"
                    className="hover:text-gold transition-colors"
                  >
                    info@precheks.com.ng
                  </a>
                </li>
                <li>
                  <a
                    href="https://precheks.com.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    precheks.com.ng
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/+447584160716"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="flex gap-4 pt-1">
                  <a href="https://www.facebook.com/chymdy.achi"  target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Facebook</a>
                  <a href="https://www.instagram.com/chymdy_kay"  target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Instagram</a>
                  <a href="https://x.com/chymdytwoo"              target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">X</a>
                  <a href="https://www.linkedin.com/in/chimdinma-onwuegbu" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">LinkedIn</a>
                </li>
              </ul>

              {/* Team */}
              <div className="mt-6 space-y-3 border-t border-paper/15 pt-5">
                <div>
                  <p className="text-sm font-semibold font-ui text-paper">Chimdinma Onwuegbu</p>
                  <p className="text-xs text-paper/60">Founder / Lead Consultant</p>
                  <a
                    href="https://www.linkedin.com/in/chimdinma-onwuegbu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:text-paper transition-colors"
                  >
                    LinkedIn →
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold font-ui text-paper">Emmanuel Adams</p>
                  <p className="text-xs text-paper/60">Consultant / Business Development Lead</p>
                  <a
                    href="https://www.linkedin.com/in/emmanuel-adams-27891354/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gold hover:text-paper transition-colors"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-paper/15 py-5 text-center text-xs text-paper/50">
            © {new Date().getFullYear()} Precheks. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
