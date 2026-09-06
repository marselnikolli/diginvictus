import React, { useEffect, useState } from "react";
import { getContent, getClients } from "./api/api.js";
import Header from "./components/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Highlights from "./sections/Highlights.jsx";
import Services from "./sections/Services.jsx";
import Process from "./sections/Process.jsx";
import Clients from "./sections/Clients.jsx";
import CtaBanner from "./sections/CtaBanner.jsx";
import Footer from "./sections/Footer.jsx";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getContent(), getClients()])
      .then(([content, clients]) => {
        document.title = content.site?.name || "DIGInvictus";
        const meta = document.querySelector('meta[name="description"]');
        if (meta && content.site?.metaDescription) {
          meta.setAttribute("content", content.site.metaDescription);
        }
        setData({ content, clients });
      })
      .catch((e) => setError(e));
  }, []);

  if (error) {
    return (
      <>
        <Header site={null} />
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
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header site={null} />
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
      </>
    );
  }

  const { content, clients } = data;

  return (
    <>
      <Header site={content.site} />
      <main>
        <Hero hero={content.hero} site={content.site} />
        <Highlights highlights={content.highlights} />
        <Services />
        <Process />
        <Clients clients={clients} />
        <CtaBanner />
        <Footer footer={content.footer} site={content.site} />
      </main>
    </>
  );
}