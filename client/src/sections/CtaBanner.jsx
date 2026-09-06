import React from "react";

export default function CtaBanner() {
  return (
    <section id="contact" className="cta-banner styled">
      <div className="cta-banner-card">
        <span className="section-eyebrow section-eyebrow--dot">Contact</span>
        <h2>Reduce your technical risk.</h2>
        <p>
          Tell us about your infrastructure and hosting challenges. We will assess your risk
          profile and propose an action plan within 24 hours.
        </p>
        <div className="cta-banner-actions">
          <a href="mailto:hello@diginvictus.com" className="button button--banner">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}