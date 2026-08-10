import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const NOTES_DIR = path.join(process.cwd(), "content/notes");

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  featured_image: string;
  excerpt: string;
};

function readAll(): { meta: NoteMeta; content: string }[] {
  const files = fs.existsSync(NOTES_DIR)
    ? fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md"))
    : [];

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(NOTES_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const plain = content.replace(/\s+/g, " ").trim();
    return {
      meta: {
        slug: data.slug || filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        date: data.date || "",
        categories: data.categories || [],
        tags: data.tags || [],
        featured_image: data.featured_image || "",
        excerpt: plain.slice(0, 180) + (plain.length > 180 ? "…" : ""),
      },
      content,
    };
  });
}

export function getAllNotes(): NoteMeta[] {
  return readAll()
    .map((n) => n.meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNotesByCategory(category: string): NoteMeta[] {
  return getAllNotes().filter((n) =>
    n.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

export async function getNoteBySlug(
  slug: string
): Promise<{ meta: NoteMeta; contentHtml: string } | null> {
  const found = readAll().find((n) => n.meta.slug === slug);
  if (!found) return null;
  const processed = await remark().use(html).process(found.content);
  return { meta: found.meta, contentHtml: processed.toString() };
}

export function getAllSlugs(): string[] {
  return readAll().map((n) => n.meta.slug);
}
