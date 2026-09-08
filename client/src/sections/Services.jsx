import React from "react";
import Icon from "../components/Icon.jsx";

const services = [
  {
    icon: "alert",
    title: "Priority Incident Response",
    description:
      "Production outage recovery, critical error resolution, malware containment, and site restoration.",
    price: "€150",
    delivery: "24–72 hours",
    features: [
      "Production downtime recovery",
      "Malware containment & cleanup",
      "Corrupted database repair",
      "Priority response within hours",
    ],
  },
  {
    icon: "trending-up",
    title: "Performance Engineering",
    description:
      "Full-stack speed optimization, database tuning, Redis caching, TTFB reduction, and hosting recommendations.",
    price: "€250",
    delivery: "3–5 days",
    features: [
      "Complete speed audit & bottleneck analysis",
      "Redis / object cache architecture",
      "Database query optimization",
      "Asset delivery & CDN tuning",
    ],
  },
  {
    icon: "shield",
    title: "Security Architecture & Hardening",
    description:
      "Threat assessment, malware remediation, WAF configuration, login hardening, and ongoing monitoring strategy.",
    price: "€200",
    delivery: "2–4 days",
    features: [
      "Malware scanning & deep cleanup",
      "WAF & brute-force protection",
      "File integrity monitoring",
      "Security roadmap & recommendations",
    ],
  },
  {
    icon: "share-2",
    title: "Migration Engineering",
    description:
      "Zero-risk site migrations with rollback guarantees, DNS + SSL management, and full environment validation.",
    price: "€150",
    delivery: "2–5 days",
    features: [
      "Zero-downtime migration plan",
      "DNS & SSL certificate transfer",
      "Environment parity verification",
      "Rollback strategy included",
    ],
  },
  {
    icon: "refresh",
    title: "Stability & Maintenance Retainer",
    description:
      "Ongoing stability management, updates, monitoring, backup verification, and priority support.",
    price: "€100",
    delivery: "Ongoing",
    bestValue: true,
    features: [
      "Core / plugin / theme updates",
      "Daily backup verification",
      "Uptime & performance monitoring",
      "Priority support & minor fixes",
    ],
  },
  {
    icon: "clipboard",
    title: "Technical Audit & Risk Assessment",
    description:
      "Comprehensive infrastructure audit covering performance, security, code quality, and a prioritized remediation roadmap.",
    price: "€300",
    delivery: "3–5 days",
    features: [
      "Full technical audit (speed, security, code, SEO)",
      "Plugin & theme code review",
      "Security vulnerability assessment",
      "Prioritized remediation roadmap",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="services-header">
        <span className="section-eyebrow section-eyebrow--dot">Services</span>
        <h2>Technical Consultancy</h2>
        <p className="services-subtitle">
          Flat-rate engineering. Clear scope, fixed price, predictable outcomes.
        </p>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div className={`services-card${s.bestValue ? " services-card--featured" : ""}`} key={i}>
            {s.bestValue && <span className="services-card-badge">Best Value</span>}
            <div className="services-card-icon">
              <Icon name={s.icon} size={28} />
            </div>
            <h3 className="services-card-title">{s.title}</h3>
            <p className="services-card-desc">{s.description}</p>
            {s.features.length > 0 && (
              <ul className="services-card-features">
                {s.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
            )}
            <div className="services-card-footer">
              <span className="services-card-from">Fixed from</span>
              <div className="services-card-rate">
                <span className="services-card-price">{s.price}</span>
                <span className="services-card-duration">· {s.delivery}</span>
              </div>
              <a
                href={`mailto:hello@diginvictus.com?subject=Engagement%20request%3A%20${encodeURIComponent(s.title)}`}
                className="text-link services-card-cta"
              >
                Request engagement
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}