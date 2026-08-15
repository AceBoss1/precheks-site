import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Precheks — Book a Session or Ask a Question",
  description:
    "Get in touch with Precheks for career coaching, data analytics consulting, or web & app development. We usually reply within a day.",
  openGraph: {
    title: "Contact Precheks",
    description:
      "Get in touch with Precheks for career coaching, data analytics consulting, or web & app development.",
    images: ["/images/brand/og-default.jpg"],
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <p className="eyebrow">Let&apos;s Get in Touch</p>
      <h1 className="font-display text-5xl mt-3">
        Do you have more questions?
      </h1>
      <p className="mt-6 text-lg text-slate font-body">
        Contact us via any of the means below, or send a message and we'll
        get back to you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 border-t-2 border-ink pt-8">
        <div>
          <p className="eyebrow">Email</p>
          <a
            href="mailto:info@precheks.com.ng"
            className="mt-2 block font-body text-lg text-ink hover:text-gold-deep"
          >
            info@precheks.com.ng
          </a>
        </div>
        <div>
          <p className="eyebrow">Gmail</p>
          <a
            href="mailto:precheks.info@gmail.com"
            className="mt-2 block font-body text-lg text-ink hover:text-gold-deep"
          >
            precheks.info@gmail.com
          </a>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
