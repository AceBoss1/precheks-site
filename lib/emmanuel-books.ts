export type Book = {
  title: string;
  subtitle?: string;
  price: string; // "Free" or a real price string; "See price" when unknown
  type: string;
  href: string;
  image: string;
};

export const EMMANUEL_BOOKS: Book[] = [
  {
    title: "From Survival To Strategy",
    subtitle: "The Hidden Structures That Prevent Growth",
    price: "Free",
    type: "Magazine",
    href: "https://lwbmag.name.ng/june-2026.html",
    image: "/images/shop/Hero-Cover-June-2026.webp",
  },
  {
    title: "The Future of Digital Money",
    subtitle: "Cryptocurrency in 2023 and Beyond",
    price: "See price on Amazon",
    type: "Ebook",
    href: "https://www.amazon.com/Future-Digital-Money-Cryptocurrency-Beyond-ebook/dp/B0CK2TRWM6?ref_=ast_author_dp&th=1&psc=1",
    image: "/images/shop/Future-Digital-Money-Cryptocurrency.jpg",
  },
  {
    title: "Entrepreneurship 101",
    subtitle: "Release The Inner Entrepreneur In You!",
    price: "See price on Amazon",
    type: "Ebook",
    href: "https://www.amazon.com/Entrepreneurship-101-Release-Inner-Entrepreneur-ebook/dp/B0BTTWHC5V?ref_=ast_author_dp&th=1&psc=1",
    image: "/images/shop/Entrepreneurship-101-Release-Inner-Entrepreneur.jpg",
  },
];
