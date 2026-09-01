import React from "react";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";

export default function Footer({ footer, site }) {
  const links = footer?.socialLinks || [];
  return (
    <footer className="footer styled">
      <div className="footer-content">
        {links.length > 0 && (
          <div className="-social">
            <ul>
              {links.map((l, i) => (
                <li key={i}>
                  <a href={l.url || "#"} target="_blank" rel="noreferrer noopener" aria-label={l.name}>
                    <Icon name={l.icon || "facebook"} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="-logo">
          <a href="#">
            <Logo className="footer-logo" />
          </a>
        </div>
        <p className="-copyright">
          <small>
            © {footer?.year || site?.year || new Date().getFullYear()}{" "}
            {footer?.copyright || site?.copyright || "All rights reserved."}
          </small>
        </p>
      </div>
    </footer>
  );
}
