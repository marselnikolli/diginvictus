import React from "react";
import Icon from "../components/Icon.jsx";
import ThreeSphere from "../components/ThreeSphere.jsx";

const stats = [
  { value: "99.9%", label: "Uptime target" },
  { value: "24/7", label: "Monitoring & support" },
  { value: "Zero", label: "Downtime deployments" },
];

export default function Hero({ hero, site }) {
  return (
    <section id="hero" className="hero">
      <ThreeSphere enabled={hero?.threejsEnabled !== false} />
      <div className="hero-bg-grid" />
      <div className="hero-scanline" />
      <div className="hero-coords" aria-hidden="true">
        <span>40.7128° N, 19.3742° E</span>
        <span>NODE dig-primary</span>
      </div>
      <div className="hero-content">
        <div className="hero-banner">
          <p className="hero-kicker">
            <span className="hero-kicker-dot" />
            Systems online · {new Date().getUTCFullYear()}
          </p>
          <h1>{hero?.headline || site?.tagline || "Building Digital"}</h1>
          {hero?.subTitle && <p className="sub-title">{hero.subTitle}</p>}
          {hero?.ctaEnabled && (
            <div className="hero-cta">
              <a
                href={hero.ctaLink || "#"}
                className="button button--banner"
              >
                {hero.ctaLabel || "Get in touch"}
              </a>
            </div>
          )}
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.value}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          {hero?.scrollEnabled && (
            <div className="hero-scroll">
              <a href="#section1" className="js--localscroll" aria-label="Scroll to highlights">
                <Icon name="arrow-down" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}