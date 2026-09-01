import React, { useEffect, useState } from "react";
import { getContent, getClients, getTestimonials } from "./api/api.js";
import Hero from "./sections/Hero.jsx";
import Highlights from "./sections/Highlights.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import Clients from "./sections/Clients.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getContent(), getClients(), getTestimonials()])
      .then(([content, clients, testimonials]) => {
        document.title = content.site?.name || "DIGInvictus";
        const meta = document.querySelector('meta[name="description"]');
        if (meta && content.site?.metaDescription) {
          meta.setAttribute("content", content.site.metaDescription);
        }
        setData({ content, clients, testimonials });
      })
      .catch((e) => setError(e));
  }, []);

  if (error) {
    return (
      <main>
        <section className="hero">
          <div className="hero-content" style={{ height: "80vh" }}>
            <div className="hero-banner">
              <h1>Building Digital</h1>
              <p className="sub-title">We&apos;re having a technical hiccup — please check back shortly.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main>
        <section className="hero">
          <div className="hero-content" style={{ height: "100vh" }}>
            <div className="hero-banner">
              <h1>Building Digital</h1>
              <p className="sub-title">Loading…</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { content, clients, testimonials } = data;

  return (
    <main>
      <Hero hero={content.hero} site={content.site} />
      <Highlights highlights={content.highlights} />
      <Testimonials testimonials={testimonials} />
      <Clients clients={clients} />
      <Footer footer={content.footer} site={content.site} />
    </main>
  );
}
