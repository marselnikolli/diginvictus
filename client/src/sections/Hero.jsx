import React from "react";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";
import ThreeSphere from "../components/ThreeSphere.jsx";

export default function Hero({ hero, site }) {
  return (
    <section id="hero" className="hero">
      <ThreeSphere enabled={hero?.threejsEnabled !== false} />
      <div className="hero-content">
        <div className="hero-header">
          <div className="-logo">
            <a href="#">
              <Logo className="logo-svg" />
            </a>
          </div>
          {hero?.ctaEnabled && (
            <div className="-cta js--localscroll">
              <a
                href={hero.ctaLink || "#"}
                className="button button--inverted button--hollow button--hollow--inverted"
              >
                {hero.ctaLabel || "Get in touch"}
              </a>
            </div>
          )}
        </div>
        <div className="hero-banner">
          <h1>{hero?.headline || site?.tagline || "Building Digital"}</h1>
          {hero?.subTitle && <p className="sub-title">{hero.subTitle}</p>}
          {hero?.scrollEnabled && (
            <div className="-cta">
              <a href="#section1" className="js--localscroll">
                <Icon name="arrow-down" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
