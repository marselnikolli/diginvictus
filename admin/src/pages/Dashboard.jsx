import React from "react";
import { Link } from "react-router-dom";

const cards = [
  { to: "/section/hero", title: "Hero", desc: "Headline, sub-title, CTA and scroll settings" },
  { to: "/section/highlights", title: "What we do", desc: "Heading and the service cards" },
  { to: "/section/site", title: "Site settings", desc: "Name, tagline, SEO meta and keywords" },
  { to: "/section/footer", title: "Footer", desc: "Copyright and social links" },
  { to: "/clients", title: "Clients", desc: "Manage client logos shown on the homepage" },
  { to: "/testimonials", title: "Testimonials", desc: "Manage the testimonial slider" },
];

export default function Dashboard() {
  return (
    <div>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Edit any part of the DIGInvictus homepage. Changes go live immediately.</p>
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
