# Precheks — Site Scaffold

A standalone Next.js site (no WordPress) with a dense, magazine-style
homepage and a full "Notes" blog, built from your recovered content.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What's included

- **Homepage** — split hero (business statement / latest Notes), dense
  headline grid, services strip, testimonials section.
- **Notes** (`/notes`) — full blog listing + individual post pages,
  reading directly from Markdown in `content/notes/` (15 real posts,
  content and images recovered from your WordPress export).
- **About, Services, Contact, Shop** — built from your real recovered
  page copy (mission/values, full services + courses list, etc).
- **Design system** — gold/ink/paper palette drawn from the Precheks
  logo, Fraunces (display) + Barlow Condensed (headline grid) +
  Source Serif 4 (body) + IBM Plex Mono (eyebrows/bylines).

## Still to do (flagging honestly, not silently skipped)

1. **Testimonial quotes** — the 3 testimonial photos (Gregory, Phebe,
   Stellamaris) are wired up on the homepage, but the actual quote text
   wasn't present anywhere in the WordPress export (it lived in a
   page-builder widget that didn't survive the export). Each card has a
   `TODO` placeholder in `app/page.tsx` — replace with the real quotes.
2. **Shop page** — `app/shop/page.tsx` has one placeholder product
   linking to a fake Selar URL. Replace with your real Selar.ng product
   links (title, description, href).
3. **One missing image** — `ms-excel-beginner-to-adva-selar.co-...jpeg`
   (used in a 2025/05 post) wasn't in your uploads backup. Grab it from
   the live site before it goes down, or replace the image reference.
4. **Contact form has no backend yet** — it's styled and ready, but
   doesn't submit anywhere. Since the CRM is deferred, wire this to a
   simple API route (or a form service) whenever you're ready — no
   need to wait for the full CRM build.
5. **Cloudinary** — Notes images are currently served from
   `public/images/notes/` (already copied in). Move them to Cloudinary
   whenever you're ready and swap the `featured_image` / inline image
   paths in `content/notes/*.md`.
6. **Dependency security** — `npm audit` flags a number of advisories
   against the Next.js version range up to 16.x (mostly Server
   Actions / Middleware / image-optimizer issues this static-heavy
   site doesn't exercise much, but worth knowing). Currently pinned to
   `14.2.35` (patched vs. the specific Dec 2025 CVE). Run `npm audit`
   yourself before going to production and decide if/when to move to
   Next 15/16.

## Structure

```
app/            Next.js App Router pages
content/notes/  Markdown source for every blog post
lib/notes.ts    Markdown loader (gray-matter + remark)
public/images/  Logo, favicon, headshots, testimonials, note images
```
