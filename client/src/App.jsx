import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { LOCALES, DEFAULT_LOCALE, DEFAULT_UI } from "shared";
import { getContent, getClients } from "./api/api.js";
import { LocaleProvider, useLocale } from "./i18n/LocaleContext.jsx";
import { getSection, localizeItem } from "./i18n/resolve.js";
import Header from "./components/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Highlights from "./sections/Highlights.jsx";
import Services from "./sections/Services.jsx";
import Process from "./sections/Process.jsx";
import Clients from "./sections/Clients.jsx";
import CtaBanner from "./sections/CtaBanner.jsx";
import Footer from "./sections/Footer.jsx";

function savedLocale() {
  try {
    const saved = localStorage.getItem("dig_locale");
    return LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${savedLocale()}`} replace />} />
        <Route path="/:lang" element={<Home />} />
        <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const { lang } = useParams();
  if (!LOCALES.includes(lang)) return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  return (
    <LocaleProvider locale={lang}>
      <Site />
    </LocaleProvider>
  );
}

function Site() {
  const locale = useLocale();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getContent(), getClients()])
      .then(([content, clients]) => setData({ content, clients }))
      .catch((e) => setError(e));
  }, []);

  const content = data?.content || null;
  const localized = content
    ? Object.fromEntries(Object.entries(content).map(([key, section]) => [key, getSection(section, locale)]))
    : null;
  const ui = localized?.ui || getSection(DEFAULT_UI, locale);

  useEffect(() => {
    if (!content?.site) return;
    const site = getSection(content.site, locale);
    document.documentElement.lang = locale;
    document.title = site.name || "DIGInvictus";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && site.metaDescription) meta.setAttribute("content", site.metaDescription);
  }, [content, locale]);

  if (error) {
    return (
      <>
        <Header site={null} ui={ui} />
        <main>
          <section className="hero">
            <div className="hero-content" style={{ height: "80vh" }}>
              <div className="hero-banner">
                <h1>Building Digital</h1>
                <p className="sub-title">{ui.errorText}</p>
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
        <Header site={null} ui={ui} />
        <main>
          <section className="hero">
            <div className="hero-content" style={{ height: "100vh" }}>
              <div className="hero-banner">
                <h1>Building Digital</h1>
                <p className="sub-title">{ui.loadingText}</p>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  const { clients } = data;

  return (
    <>
      <Header site={localized.site} ui={localized.ui} />
      <main>
        <Hero hero={localized.hero} site={localized.site} ui={localized.ui} />
        <Highlights highlights={localized.highlights} />
        <Services services={localized.services} />
        <Process process={localized.process} />
        <Clients clients={clients.map((c) => localizeItem(c, locale))} ui={localized.ui} />
        <CtaBanner cta={localized.cta} />
        <Footer footer={localized.footer} site={localized.site} ui={localized.ui} />
      </main>
    </>
  );
}
