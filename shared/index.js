export const DEFAULT_SITE = {
  name: "DIGInvictus",
  tagline: "Building Digital",
  metaDescription:
    "DIGInvictus — web development, server infrastructure and managed hosting. Secure, fast and reliable digital products.",
  keywords:
    "web development, server infrastructure, managed hosting, maintenance, technical support, hosting, devops",
  copyright: "All rights reserved.",
  year: "2026",
};

export const DEFAULT_HERO = {
  headline: "Building Digital",
  subTitle: "Web Development · Infrastructure · Hosting",
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
      icon: "server",
      title: "Server Infrastructure",
      description:
        "Design, deployment and hardening of production servers, containers and cloud-like infrastructure that stays secure, fast and reliable.",
    },
    {
      icon: "database",
      title: "Managed Hosting",
      description:
        "Secure, high-performance hosting with proactive monitoring, automated backups and zero-downtime updates.",
    },
    {
      icon: "refresh",
      title: "Maintenance & Support",
      description:
        "Ongoing stability management, updates, monitoring, backup verification and priority support for your digital products.",
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
  { id: 1, name: "OTP Bank Albania", websiteUrl: "https://otpbank.al/sq/", logo: "/assets/otp-logo-white.svg", description: "Corporate website, digital presence and ongoing web maintenance.", active: 1, order: 1 },
  { id: 2, name: "Dajti Ekspres", websiteUrl: "https://dajtiekspres.com/", logo: "/assets/dajti-logo.svg", description: "Website development and digital experience for the Dajti Express railway.", active: 1, order: 2 },
  { id: 3, name: "Telesport", websiteUrl: "https://telesport.al/", logo: "/assets/telesport-white.svg", description: "Sports news portal with fast, responsive content delivery.", active: 1, order: 3 },
  { id: 4, name: "GKHair Albania", websiteUrl: "https://gkhair.al/", logo: "/assets/gk_hair_logo.png", description: "Brand website and online presence for the GK Hair salon brand.", active: 1, order: 4 },
  { id: 5, name: "Bare Flowers", websiteUrl: "https://www.bareflowers.com/", logo: "/assets/bareflowers_logo.png", description: "E-commerce storefront and digital design.", active: 1, order: 5 },
  { id: 6, name: "Kryefjala", websiteUrl: "https://kryefjala.com/", logo: "/assets/kryefjala-logo.svg", description: "News platform front-end and digital publishing experience.", active: 1, order: 6 },
  { id: 7, name: "Kryqi Kuq Shqiptar", websiteUrl: "https://www.kksh.org.al/", logo: "/assets/kksh-logo.svg", description: "NGO website, digital presence and brand support for the Albanian Red Cross.", active: 1, order: 7 },
  { id: 8, name: "Ringside", websiteUrl: "https://ringside.al", logo: "/assets/ringside-logo.png", description: "High-traffic website infrastructure, performance tuning and zero-downtime deployments.", active: 1, order: 8 },
  { id: 9, name: "Bojken Lako", websiteUrl: "https://bojkenlako.com", logo: "/assets/bojken-logo.png", description: "Official artist website for singer and composer Bojken Lako — digital presence, identity and fan-facing media.", active: 1, order: 9 },
  { id: 10, name: "RTSH", websiteUrl: "https://rtsh.al", logo: "/assets/rtsh-logo.svg", description: "High-traffic national broadcaster platform — performance, stability and hosting for the Albanian public media.", active: 1, order: 10 },
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
