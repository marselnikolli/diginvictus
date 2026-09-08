import ThreeSphere from "../components/ThreeSphere.jsx";

export default function Hero({ hero, site }) {
  return (
    <section id="hero" className="hero">
      <ThreeSphere enabled={hero?.threejsEnabled !== false} />
      <div className="hero-bg-grid" />
      <div className="hero-content">
        <div className="hero-banner">
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
          {hero?.scrollEnabled && (
            <div className="hero-scroll">
              <a href="#section1" className="js--localscroll" aria-label="Scroll to highlights">
                ▼
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}