import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";

const links = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Header({ site }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header-inner">
        <a href="#" className="header-logo" aria-label={site?.name || "DIGInvictus"}>
          <Logo />
        </a>
        <span className="header-status" aria-hidden="true">
          <span className="header-dot" />
          systems online
        </span>
        <nav className="header-nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:hello@diginvictus.com"
          className="button button--banner"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}