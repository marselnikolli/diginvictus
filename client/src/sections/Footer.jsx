import React from "react";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";

const explore = [
  { label: "Services", href: "#services" },
  { label: "How We Work", href: "#process" },
  { label: "Recent Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ footer, site }) {
  const links = footer?.socialLinks || [];
  return (
    <footer className="footer styled">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#" className="footer-brand-logo">
            <Logo className="footer-logo" />
          </a>
          <p className="footer-tagline">
            {site?.tagline || "Building Digital"} — web development, server infrastructure and
            managed hosting engineered for stability.
          </p>
        </div>
        <div className="footer-col">
          <h5>Explore</h5>
          <ul>
            {explore.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li>
              <a href="mailto:hello@diginvictus.com">hello@diginvictus.com</a>
            </li>
          </ul>
          {links.length > 0 && (
            <ul className="footer-social">
              {links.map((l, i) => (
                <li key={i}>
                  <a
                    href={l.url || "#"}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={l.name}
                  >
                    <Icon name={l.icon || "facebook"} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p className="-copyright">
          <small>
            © {footer?.year || site?.year || new Date().getFullYear()}{" "}
            {site?.name || "DIGInvictus"}.{" "}
            {footer?.copyright || site?.copyright || "All rights reserved."}
          </small>
        </p>
        <p className="footer-status" aria-label="Systems status">
          <span className="footer-status-dot" />
          all systems operational
        </p>
      </div>
    </footer>
  );
}