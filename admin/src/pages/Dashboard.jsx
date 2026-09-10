import React from "react";
import { Link } from "react-router-dom";

const cards = [
  { to: "/section/hero", title: "Hero", desc: "Headline, sub-title, CTA and scroll settings" },
  { to: "/section/highlights", title: "What we do", desc: "Heading and the capability cards" },
  { to: "/section/services", title: "Services", desc: "Service cards, prices and features" },
  { to: "/section/process", title: "Process", desc: "The three methodology steps" },
  { to: "/section/cta", title: "Contact banner", desc: "Contact section heading, text and button" },
  { to: "/section/ui", title: "Navigation & labels", desc: "Menu labels, status text and small UI strings" },
  { to: "/section/site", title: "Site settings", desc: "Name, tagline, SEO meta and keywords" },
  { to: "/section/footer", title: "Footer", desc: "Copyright, tagline and social links" },
  { to: "/clients", title: "Clients", desc: "Manage client logos shown on the homepage" },
  { to: "/testimonials", title: "Testimonials", desc: "Manage the testimonial slider" },
];

export default function Dashboard() {
  return (
    <div>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Edit any part of the DIGInvictus homepage in English, Italian and Albanian. Changes go live immediately.</p>
      </header>
      <div className="cards">
        {cards.map((card) => (
          <Link to={card.to} className="card" key={card.to}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
