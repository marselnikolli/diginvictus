export const DEFAULT_SITE = {
  name: "DIGInvictus",
  tagline: "Building Digital",
  metaDescription: "DIGInvictus. Building Digital",
  keywords: "web development, graphic design, smm, digital marketing, marketing, social media management, branding",
  copyright: "All rights reserved.",
  year: "2023",
};

export const DEFAULT_HERO = {
  headline: "Building Digital",
  subTitle: "New website uploading shortly",
  ctaLabel: "Get in touch",
  ctaLink: "mailto:hello@diginvictus.com",
  ctaEnabled: true,
  scrollEnabled: true,
  threejsEnabled: true,
};

export const DEFAULT_HIGHLIGHTS = {
  heading: "What we do.",
  items: [
    {
      icon: "code",
      title: "Web Development",
      description:
        "Modern, fast and responsive websites built with the latest technologies and a strong focus on performance and user experience.",
    },
    {
      icon: "pen-tool",
      title: "Graphic Design",
      description:
        "Bold visual identities, branding and design systems that make your business stand out and stay memorable.",
    },
    {
      icon: "share-2",
      title: "Social Media Management",
      description:
        "Strategy, content and community management across your social channels to grow your audience and engagement.",
    },
    {
      icon: "trending-up",
      title: "Digital Marketing",
      description:
        "Data-driven campaigns, SEO and paid media that turn attention into customers and measureable results.",
    },
  ],
};

export const DEFAULT_FOOTER = {
  copyright: "All rights reserved.",
  socialLinks: [
    { name: "Facebook", url: "#", icon: "facebook" },
    { name: "Instagram", url: "#", icon: "instagram" },
    { name: "LinkedIn", url: "#", icon: "linkedin" },
    { name: "Twitter", url: "#", icon: "twitter" },
  ],
};

export const DEFAULT_CLIENTS = [
  { id: 1, name: "OTP Bank Albania", websiteUrl: "https://otpbank.al/sq/", logo: "/assets/otp-logo-white.svg", active: 1, order: 1 },
  { id: 2, name: "Dajti Ekspres", websiteUrl: "https://dajtiekspres.com/", logo: "/assets/dajti-logo.svg", active: 1, order: 2 },
  { id: 3, name: "Telesport", websiteUrl: "https://telesport.al/", logo: "/assets/telesport-white.svg", active: 1, order: 3 },
  { id: 4, name: "GKHair Albania", websiteUrl: "https://gkhair.al/", logo: "/assets/gk_hair_logo.png", active: 1, order: 4 },
  { id: 5, name: "Bare Flowers", websiteUrl: "https://www.bareflowers.com/", logo: "/assets/bareflowers_logo.png", active: 1, order: 5 },
  { id: 6, name: "Kryefjala", websiteUrl: "https://kryefjala.com/", logo: "/assets/kryefjala-logo.svg", active: 1, order: 6 },
  { id: 7, name: "Kryqi Kuq Shqiptar", websiteUrl: "https://www.kksh.org.al/", logo: "/assets/kksh-logo.svg", active: 1, order: 7 },
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote:
      "DIGInvictus delivered a website that perfectly represents our brand. Professional, creative and always on time.",
    author: "Client Name",
    role: "Marketing Director",
    company: "Example Company",
    active: 1,
    order: 1,
  },
  {
    id: 2,
    quote:
      "Their team handled our social media and the growth was immediate. Highly recommended digital partner.",
    author: "Another Client",
    role: "CEO",
    company: "Another Company",
    active: 1,
    order: 2,
  },
];

export const DEFAULT_ADMIN = {
  email: "admin@diginvictus.com",
  password: "admin123",
};

export const CONTENT_SECTIONS = ["site", "hero", "highlights", "footer"];
