import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function Header({ site, ui }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: ui?.navServices || "Services", href: "#services" },
    { label: ui?.navProcess || "Process", href: "#process" },
    { label: ui?.navWork || "Work", href: "#work" },
    { label: ui?.navContact || "Contact", href: "#contact" },
  ];

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#" className="header-logo" aria-label={site?.name || "DIGInvictus"}>
          <Logo />
        </a>
        <span className="header-status" aria-hidden="true">
          <span className="header-dot" />
          {ui?.headerStatus || "systems online"}
        </span>
        <nav className="header-nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
        <a href="mailto:hello@diginvictus.com" className="button button--banner">
          {ui?.getInTouch || "Get in touch"}
        </a>
      </div>
    </header>
  );
}
