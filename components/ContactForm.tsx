"use client";

import { useState } from "react";
import { createLead } from "@/lib/leads";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await createLead({ name, email, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-14 border-t-2 border-ink pt-10">
        <p className="font-display text-2xl">Message sent.</p>
        <p className="mt-2 text-slate font-body">
          Thanks for reaching out — we'll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 font-ui text-sm font-semibold uppercase tracking-wideish text-gold-deep hover:text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-14 grid grid-cols-1 gap-6 border-t-2 border-ink pt-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="eyebrow">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
          />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
          />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full border border-rule bg-card px-4 py-3 font-body focus:border-gold outline-none"
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending your message — please try again, or
          email us directly using the addresses above.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="justify-self-start bg-gold text-ink font-ui font-semibold px-6 py-3 hover:bg-gold-deep hover:text-paper transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
