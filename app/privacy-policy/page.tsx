export const metadata = {
  title: "Privacy Policy",
  description: "How Precheks collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Legal</p>
      <h1 className="font-display text-5xl mt-3">Privacy Policy</h1>
      <p className="mt-4 text-sm text-slate font-mono">Last updated: 2026</p>

      <div className="mt-10 prose prose-lg max-w-none font-body text-ink prose-headings:font-display prose-a:text-gold-deep">
        <h2>Who we are</h2>
        <p>
          This policy covers precheks.com.ng, operated by Precheks. If you
          have questions about your data, contact us at{" "}
          <a href="mailto:precheks.info@gmail.com">precheks.info@gmail.com</a>.
        </p>

        <h2>Account data</h2>
        <p>
          If you create an account to comment or like Notes, we use Firebase
          Authentication (a Google service) to manage your sign-in, and we
          store a public profile in our database — your display name,
          username, bio, avatar, and any social links you choose to add.
          Your email address is used for sign-in and is not shown publicly.
        </p>

        <h2>Comments, likes, and shares</h2>
        <p>
          When you comment on a Note, your comment, your username, and a
          timestamp are stored and shown publicly alongside the Note. Likes
          and share counts are recorded against your account so you can't
          like the same Note twice, but individual likes are not shown
          publicly. You can delete your own comments at any time.
        </p>

        <h2>Contact form</h2>
        <p>
          If you submit the contact form, we store your name, email address,
          and message so our team can respond to you. This information is
          only visible to Precheks staff, never published, and is used
          solely to follow up on your enquiry.
        </p>

        <h2>Where your data is stored</h2>
        <p>
          Account and site data is stored using Google Firebase (Cloud
          Firestore and Firebase Authentication). Images you or we upload —
          profile pictures and Note images — are hosted by Cloudinary. The
          site itself is hosted on Vercel. Each of these providers has its
          own security practices and privacy policy governing infrastructure
          they operate.
        </p>

        <h2>Cookies and local storage</h2>
        <p>
          We don't use advertising or tracking cookies. Firebase
          Authentication uses your browser's local storage to keep you
          signed in between visits — this is functional, not used for
          tracking or advertising, and is cleared when you sign out.
        </p>

        <h2>Third-party links</h2>
        <p>
          Notes and the Shop page may link to third-party sites — including
          Selar and Amazon for products, and social media profiles. Once you
          leave precheks.com.ng, that site's own privacy policy applies, not
          ours.
        </p>

        <h2>Your rights</h2>
        <p>
          You can update your profile information at any time from your
          profile settings. To request a copy of your data, or to request
          that we delete your account and associated data, email{" "}
          <a href="mailto:precheks.info@gmail.com">precheks.info@gmail.com</a>{" "}
          and we'll act on it as soon as we can.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes in a meaningful way, we'll update the date
          at the top of this page.
        </p>
      </div>
    </section>
  );
}
