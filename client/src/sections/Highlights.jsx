import React from "react";
import Icon from "../components/Icon.jsx";
import glow1 from "../assets/rainbow-glow-1.png";

export default function Highlights({ highlights }) {
  if (!highlights) return null;
  return (
    <section id="section1" className="highlights styled">
      <div className="highlights-header">
        <h2>{highlights.heading}</h2>
      </div>
      {highlights.items && highlights.items.length > 0 && (
        <div className="highlights-grid">
          {highlights.items.map((item, i) => (
            <div className="highlights-icon-box" key={i}>
              <div className="-icon">
                <Icon name={item.icon || "code"} />
              </div>
              <div className="-content">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <img src={glow1} className="highlights-glow" alt="Rainbow glow 1" />
    </section>
  );
}
