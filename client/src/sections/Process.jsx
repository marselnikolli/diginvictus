import React from "react";

export default function Process({ process }) {
  if (!process) return null;
  const steps = process.steps || [];
  return (
    <section id="process" className="process styled">
      <div className="process-header">
        <span className="section-eyebrow section-eyebrow--dot">{process.eyebrow || "Methodology"}</span>
        <h2>{process.heading}</h2>
        <p className="process-subtitle">{process.subtitle}</p>
      </div>
      <div className="process-grid">
        {steps.map((s, i) => (
          <div className="process-step" key={i}>
            <span className="process-step-number">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
