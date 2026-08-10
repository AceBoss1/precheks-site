export const metadata = { title: "Contact — Precheks" };

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
          <p className="eyebrow">Online</p>
          <p className="mt-2 font-body text-lg">precheks.com.ng</p>
        </div>
      </div>

      {/*
        NOTE: This form has no backend yet — CRM/lead capture is deferred.
        Wire this up to an API route (or a simple mailto/form service) when
        the CRM phase begins.
      */}
      <form className="mt-14 grid grid-cols-1 gap-6 border-t-2 border-ink pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="eyebrow">Name</span>
            <input
              type="text"
              name="name"
              className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              name="email"
              className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
            />
          </label>
        </div>
        <label className="block">
          <span className="eyebrow">Message</span>
          <textarea
            name="message"
            rows={5}
            className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
          />
        </label>
        <button
          type="submit"
          className="justify-self-start bg-gold text-ink font-ui font-semibold px-6 py-3 hover:bg-gold-deep hover:text-paper transition-colors"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
