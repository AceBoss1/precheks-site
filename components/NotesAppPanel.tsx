"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";

type Row = Record<string, unknown>;
type Page = { data: Row[] };
type Summary = {
  bookings: Page;
  orders: Page;
  digital: Page;
  earnings: Page & { summary: Record<string, { count: number; net_kobo: number }> };
};

const naira = (kobo: unknown) =>
  "₦" + (Number(kobo || 0) / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 });

export default function NotesAppPanel({ user }: { user: User }) {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/notesapp/summary", {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || body.error || "Request failed");
        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't load NotesApp data");
      }
    })();
  }, [user]);

  const summary = data?.earnings.summary || {};
  const sum = (k: string) => summary[k]?.net_kobo || 0;
  const totalNet = Object.values(summary).reduce((s, v) => s + v.net_kobo, 0);

  const cards = [
    { label: "Bookings", value: data?.bookings.data.length },
    { label: "Orders", value: data?.orders.data.length },
    { label: "Digital Sales", value: data?.digital.data.length },
    { label: "Earnings (net)", value: data && naira(totalNet) },
    { label: "Held", value: data && naira(sum("held")) },
    { label: "Paid Out", value: data && naira(sum("paid")) },
  ];

  const list = (title: string, rows: Row[] | undefined, line: (r: Row) => string) => (
    <div>
      <p className="eyebrow">{title}</p>
      {!rows ? (
        <p className="mt-3 text-sm text-slate">{error ? "—" : "Loading…"}</p>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate">Nothing yet.</p>
      ) : (
        <div className="mt-3 divide-y divide-rule">
          {rows.slice(0, 5).map((r) => (
            <p key={String(r.id)} className="py-2 text-sm font-mono text-ink">
              {line(r)}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-12">
      <p className="eyebrow">NotesApp — Bookings, Orders &amp; Earnings</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
        {cards.map((c) => (
          <div key={c.label} className="border border-rule bg-card p-5">
            <p className="font-display text-3xl text-ink">{error ? "—" : c.value ?? "…"}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-eyebrow text-slate">
              {c.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate">Counts reflect the 25 most recent records.</p>
      <div className="grid sm:grid-cols-2 gap-8 mt-8">
        {list("Recent Bookings", data?.bookings.data, (r) =>
          `${r.date} ${r.slot} · ${r.minutes}m · ${naira(r.amount_kobo)} · ${r.status}`)}
        {list("Recent Orders", data?.orders.data, (r) =>
          `${r.item_title} ×${r.quantity} · ${naira(r.amount_kobo)} · ${r.status}`)}
        {list("Recent Digital Sales", data?.digital.data, (r) =>
          `${r.item_title ?? r.id} · ${naira(r.amount_kobo)}`)}
        {list("Recent Earnings", data?.earnings.data, (r) =>
          `${r.kind} · net ${naira(r.net_kobo)} · ${r.status}`)}
      </div>
    </div>
  );
}
