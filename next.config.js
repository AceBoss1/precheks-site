/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // NotesApp media (R2) — images uploaded via /api/media/upload.
      // Exact hosts first (posts imported from NotesApp use these), then
      // wildcards as a fallback for other NotesApp subdomains.
      { protocol: "https", hostname: "media.notesapp.name.ng" },
      { protocol: "https", hostname: "media.naapp.tech" },
      { protocol: "https", hostname: "**.notesapp.name.ng" },
      { protocol: "https", hostname: "**.naapp.tech" },
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
};

module.exports = nextConfig;
