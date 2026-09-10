import React from "react";

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/\/+$/, "");
  } catch {
    return url || "";
  }
}

export default function Clients({ clients, ui }) {
  if (!clients || clients.length === 0) return null;
  const active = clients.filter((c) => c.active);
  return (
    <section id="work" className="clients styled">
      <div className="clients-content">
        <div className="clients-header">
          <span className="section-eyebrow section-eyebrow--dot">{ui?.workEyebrow || "Recent work"}</span>
          <h2>{ui?.workHeading || "Selected Engagements"}</h2>
          <p className="clients-subtitle">{ui?.workSubtitle}</p>
        </div>
        <ul className="clients-grid">
          {active.map((c) => (
            <li key={c.id}>
              <a
                href={c.websiteUrl || "#"}
                target="_blank"
                rel="noreferrer noopener"
                className="clients-card"
              >
                <div className="clients-card-head">
                  <div className="clients-card-logo">
                    {c.logo ? (
                      <img src={c.logo} alt={c.name} loading="lazy" />
                    ) : (
                      <span>{c.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="clients-card-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
                <div className="clients-card-body">
                  <h3 className="clients-card-name">{c.name}</h3>
                  <span className="clients-card-domain">{hostnameOf(c.websiteUrl)}</span>
                  {c.description && <p className="clients-card-desc">{c.description}</p>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
