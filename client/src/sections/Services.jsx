import React from "react";
import Icon from "../components/Icon.jsx";

export default function Services({ services }) {
  if (!services) return null;
  const items = services.items || [];
  return (
    <section id="services" className="services">
      <div className="services-header">
        <span className="section-eyebrow section-eyebrow--dot">{services.eyebrow || "Services"}</span>
        <h2>{services.heading}</h2>
        <p className="services-subtitle">{services.subtitle}</p>
      </div>
      <div className="services-grid">
        {items.map((s, i) => (
          <div className={`services-card${s.bestValue ? " services-card--featured" : ""}`} key={i}>
            {s.bestValue && <span className="services-card-badge">{services.bestValueLabel || "Best Value"}</span>}
            <div className="services-card-icon">
              <Icon name={s.icon || "code"} size={28} />
            </div>
            <h3 className="services-card-title">{s.title}</h3>
            <p className="services-card-desc">{s.description}</p>
            {s.features && s.features.length > 0 && (
              <ul className="services-card-features">
                {s.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            )}
            <div className="services-card-footer">
              <span className="services-card-from">{services.fromLabel || "Fixed from"}</span>
              <div className="services-card-rate">
                <span className="services-card-price">{s.price}</span>
                <span className="services-card-duration">· {s.delivery}</span>
              </div>
              <a
                href={`mailto:hello@diginvictus.com?subject=Engagement%20request%3A%20${encodeURIComponent(s.title)}`}
                className="text-link services-card-cta"
              >
                {services.ctaLabel || "Request engagement"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
