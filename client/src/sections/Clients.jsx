import React from "react";
import glow2 from "../assets/rainbow-glow-2.png";

export default function Clients({ clients }) {
  if (!clients || clients.length === 0) return null;
  const active = clients.filter((c) => c.active);
  return (
    <section className="clients styled">
      <div className="clients-content">
        <ul className="-clients">
          {active.map((c) => (
            <li key={c.id}>
              <a href={c.websiteUrl || "#"} target="_blank" rel="noreferrer noopener">
                <img src={c.logo} width="112" alt={c.name} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <img src={glow2} className="clients-glow" alt="Rainbow glow 2" />
    </section>
  );
}
