import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/firestore-notes";
import { getAllUsers } from "@/lib/users";

const BASE_URL = "https://www.precheks.com.ng";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/notes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/shop`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let notePages: MetadataRoute.Sitemap = [];
  let profilePages: MetadataRoute.Sitemap = [];

  try {
    const notes = await getAllNotes();
    notePages = notes.map((n) => ({
      url: `${BASE_URL}/notes/${n.slug}`,
      lastModified: n.date ? new Date(n.date) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Firestore unreachable at build time — sitemap still ships with
    // static pages; notes/[slug] pages are still crawlable via /notes.
  }

  try {
    const users = await getAllUsers();
    profilePages = users.map((u) => ({
      url: `${BASE_URL}/u/${u.username}`,
      changeFrequency: "monthly",
      priority: 0.4,
    }));
  } catch {
    // same fallback as above
  }

  return [...staticPages, ...notePages, ...profilePages];
}
