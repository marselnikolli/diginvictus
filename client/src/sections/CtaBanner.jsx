import React from "react";

export default function CtaBanner({ cta }) {
  if (!cta) return null;
  return (
    <section id="contact" className="cta-banner styled">
      <div className="cta-banner-card">
        <span className="section-eyebrow section-eyebrow--dot">{cta.eyebrow || "Contact"}</span>
        <h2>{cta.heading}</h2>
        <p>{cta.text}</p>
        <div className="cta-banner-actions">
          <a href={cta.ctaLink || "mailto:hello@diginvictus.com"} className="button button--banner">
            {cta.ctaLabel || "Get in touch"}
          </a>
        </div>
      </div>
    </section>
  );
}
