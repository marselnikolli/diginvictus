import React from "react";
import Icon from "../components/Icon.jsx";

export default function Highlights({ highlights }) {
  if (!highlights) return null;
  return (
    <section id="section1" className="highlights styled">
      <div className="highlights-header">
        <span className="section-eyebrow section-eyebrow--dot">Core capabilities</span>
        <h2>{highlights.heading}</h2>
        <p className="highlights-subtitle">
          Web development and infrastructure services engineered to keep your digital products
          secure, fast and always available.
        </p>
      </div>
      {highlights.items && highlights.items.length > 0 && (
        <div className="highlights-grid">
          {highlights.items.map((item, i) => (
            <div className="highlights-card" key={i}>
              <div className="highlights-card-icon">
                <Icon name={item.icon || "code"} size={24} />
              </div>
              <h5 className="highlights-card-title">{item.title}</h5>
              <p className="highlights-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}