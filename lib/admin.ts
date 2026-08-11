// EDIT THIS FILE: replace the two placeholder emails below with the real
// email addresses used for the two Firebase Authentication accounts you
// created for the CMS (see README). These emails must match EXACTLY
// what's in firestore.rules — the two files are kept in sync manually.

export const ADMIN_PROFILES: Record<
  string,
  {
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    social: SocialLinks;
  }
> = {
  "ezurukam@gmail.com": {
    username: "emmanuel",
    displayName: "Emmanuel Adams",
    avatar: "/images/headshots/emmanuel-adams-1.jpeg",
    bio: "Business Development Lead at Precheks.",
    social: {
      linkedin: "https://www.linkedin.com/in/emmanuel-adams-27891354",
      facebook: "https://facebook.com/Mr.EmmanuelAdams",
      instagram: "https://instagram.com/itsemmanueladams",
      twitter: "https://x.com/TweetsbyAdams",
      whatsapp: "https://wa.me/+2347038688359",
    },
  },
  "precheks.info@gmail.com": {
    username: "chimdinma",
    displayName: "Chimdinma Onwuegbu",
    avatar: "/images/headshots/chimdinma-onwuegbu-2-professional.jpeg",
    bio: "Founder & Lead Consultant at Precheks.",
    social: {
      linkedin: "https://www.linkedin.com/in/chimdinma-onwuegbu",
      facebook: "https://www.facebook.com/chymdy.achi",
      instagram: "https://www.instagram.com/chymdy_kay",
      twitter: "https://x.com/chymdytwoo",
      whatsapp: "https://wa.me/+447918285805",
    },
  },
};

export type SocialLinks = {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  website?: string;
};

export function isAdminEmail(email?: string | null): boolean {
  return !!email && email in ADMIN_PROFILES;
}
