"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { getAllLeads, updateLeadStatus, deleteLead, Lead, LeadStatus } from "@/lib/leads";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-gold/20 text-gold-deep",
  contacted: "bg-slate/10 text-slate",
  converted: "bg-ink text-paper",
};

export default function AdminLeadsPage() {
  const { user, loading } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLeads(await getAllLeads());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    await updateLeadStatus(id, status);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead? This can't be undone.")) return;
    await deleteLead(id);
    load();
  }

  if (loading || !user) {
    return <div className="px-6 py-24 text-center text-slate">Loading…</div>;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/admin"
        className="font-ui text-xs font-semibold uppercase tracking-wideish text-gold-deep"
      >
        ← Dashboard
      </Link>
      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div>
          <p className="eyebrow">Contact Form Submissions</p>
          <h1 className="font-display text-4xl mt-2">Leads</h1>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

      {!leads ? (
        <p className="mt-8 text-slate">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="mt-8 text-slate">
          No leads yet — submissions from the Contact page will show up here.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-rule">
          {leads.map((l) => (
            <div key={l.id} className="py-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-ui font-semibold text-ink">{l.name}</p>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 ${STATUS_STYLES[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-sm text-gold-deep hover:text-ink"
                  >
                    {l.email}
                  </a>
                  <p className="text-xs text-slate mt-1 font-mono">
                    {new Date(l.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <select
                    value={l.status}
                    onChange={(e) =>
                      handleStatusChange(l.id, e.target.value as LeadStatus)
                    }
                    className="border border-rule bg-card px-3 py-1.5 text-sm focus:border-gold outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-sm text-red-700 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink font-body max-w-2xl">
                {l.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
