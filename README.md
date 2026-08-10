# Precheks — Site Scaffold

A standalone Next.js site (no WordPress) with a dense, magazine-style
homepage, a full "Notes" blog with a CMS (publish/edit/delete),
category filtering, reader accounts, comments, likes, shares, view
counts, and clickable @username profiles — built on Firestore +
Cloudinary.

## Setup — one-time

1. **Firebase project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com) → Create a project.
   - **Build → Firestore Database** → Create database → start in **production mode**.
   - **Build → Authentication** → get started → enable **Email/Password**.
   - Under **Authentication → Users**, add one user per admin (you and
     Chimdinma) with an email + password you choose — **note these
     exact emails**, you'll need them in step 2.
   - **Project settings → Your apps → Add app → Web** — copy the config
     values into `.env.local` (copy `.env.local.example` first).
   - **Firestore Database → Rules** — paste in the contents of
     `firestore.rules`, then Publish.

2. **Wire up the two admin emails** (controls who can publish/delete
   posts and who gets auto-tagged as Precheks Team)
   - Open `lib/admin.ts` — replace the two placeholder emails with the
     real emails from step 1.
   - Open `firestore.rules` — replace the same two placeholder emails
     inside `isAdmin()`, then re-paste/publish in the Firebase Console.
   - These two files must always match exactly.

3. **Cloudinary** (for Notes images and avatars)
   - Sign up at [cloudinary.com](https://cloudinary.com) — free tier is
     plenty.
   - Dashboard → copy your **Cloud Name** into `.env.local`.
   - Settings → Upload → Upload presets → Add upload preset → set
     **Signing Mode to "Unsigned"** → copy the preset name into
     `.env.local`.

4. **One Firestore index you'll need** — the first time someone's
   public profile is visited, Firestore may throw an error asking you
   to create a composite index for the comment-activity query. This is
   normal and only happens once: click the link in the error message
   (or your server logs), it opens the Firebase Console with the index
   pre-filled — click Create, wait ~1 minute, done.

5. **Install & run**
   ```bash
   npm install
   npm run dev
   ```

6. **Import your existing 15 posts** — sign in at `/admin/login` (this
   also auto-creates your public @username profile from `lib/admin.ts`),
   then visit `/admin/seed` and click "Import 15 Posts".

## Using the CMS (admins only)

- **`/admin/login`** → **`/admin/notes`** — list every note
  (draft + published), Edit or Delete, or **+ New Note**.
- The form: title (auto-slug, editable), categories/tags, author
  picker (Chimdinma or Emmanuel), Cloudinary featured-image upload,
  Markdown content, Draft/Published toggle.
- Real security lives in `firestore.rules`, not the page — Firestore
  itself refuses writes from non-admin accounts.

## Reader accounts

- **`/signup`** — anyone can create an account: display name, a unique
  `@username` (reserved atomically, no two people can grab the same
  one), email, password.
- **`/login`** — sign back in. The masthead shows **Sign In / Sign Up**
  when logged out, or **@yourusername** + Sign Out when logged in.
- **`/profile/edit`** — any signed-in user (reader or admin) can edit
  their own display name, bio, avatar (Cloudinary upload), and social
  links (LinkedIn, Instagram, Facebook, X, WhatsApp, website).
- **`/u/[username]`** — the public profile page: avatar, bio, social
  links, a "Precheks Team" badge for admins, their authored posts (if
  admin), and their recent comment activity (linking back to each
  note).

## Engagement — comments, likes, shares, views

- **Comments** — any signed-in reader can comment on a Note. Each
  comment shows the commenter's avatar and clickable `@username`.
  Comment authors can delete their own; admins can moderate/delete any.
- **Likes** — signed-in readers can like a Note (heart toggles,
  count updates live). Signed-out visitors are sent to `/login` when
  they try.
- **Shares** — anyone can share (uses the native Share sheet on
  mobile, falls back to "copy link" on desktop); every share bumps a
  public counter.
- **Views** — counted once per browser session per Note (not once per
  page refresh) so casual reloading doesn't inflate the number.
- All counters live directly on the note's Firestore document
  (`viewCount`, `likeCount`, `shareCount`) and update atomically via
  Firestore's `increment()` — no risk of lost updates under load.

## Public site

- **Homepage** — split hero, dense headline grid, services strip,
  testimonials. "Led by Chimdinma Onwuegbu" now links to her real
  `/u/chimdinma` profile.
- **`/notes`** — full listing with clickable category pills
  (**All** + every category in use).
- **`/notes/[slug]`** — author byline now links to `@username` when
  that person has a profile, date + reading time, article body, the
  engagement bar (like/share/view), comments, and "More from Notes".
- **About, Services, Contact, Shop** — static pages from your real
  recovered content.

## Still to do

1. **Shop page** — `app/shop/page.tsx` has one placeholder product.
   Replace with your real Selar.ng product links.
2. **One missing image** — `ms-excel-beginner-to-adva-selar.co-...jpeg`
   wasn't in your uploads backup.
3. **Contact form** — styled, not wired to anything yet.
4. **Dependency security** — `npm audit` flags advisories against the
   Next.js version range up to 16.x. Currently pinned to `14.2.35`.
   Review before production.
5. **Comment moderation at scale** — right now moderation is just
   "author or admin can delete." If comment volume grows, consider
   adding a report/flag system.

## Structure

```
app/                       Next.js App Router pages
app/admin/                 CMS: login, notes list, new/edit forms, seed importer
app/signup, app/login      Reader account creation and sign-in
app/u/[username]/          Public profile pages
app/profile/edit/          Edit your own profile
components/NoteForm.tsx    Shared create/edit form
components/NotesGrid.tsx   Category filter + grid (client component)
components/Comments.tsx    Comment thread + post form
components/SocialBar.tsx   Like / share / view-count bar
components/AuthNav.tsx     Sign in/out state in the masthead
lib/firebase.ts            Firebase client SDK init
lib/firestore-notes.ts     Firestore CRUD for notes (+ counters)
lib/engagement.ts          Views, likes, shares, comments
lib/users.ts                Profile CRUD, username reservation, activity queries
lib/admin.ts                EDIT THIS: the two admin emails + their known profile info
lib/cloudinary.ts          Unsigned image upload helper
lib/seed-notes.json        Your 15 recovered posts, ready to import
firestore.rules            EDIT THIS TOO (same two emails) — deploy in Firebase Console
public/images/             Logo, favicon, headshots, testimonials, note images
```


