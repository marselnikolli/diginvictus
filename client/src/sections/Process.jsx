import React from "react";

const steps = [
  {
    title: "Risk Assessment",
    description:
      "We audit your infrastructure, identify vulnerabilities and scope the work. You receive a clear proposal with timeline and fixed price.",
  },
  {
    title: "Engineering & Resolution",
    description:
      "We perform the work — incident response, performance optimization, security hardening or migration — with continuous updates and rollback guarantees.",
  },
  {
    title: "Stabilisation & Handover",
    description:
      "Your system is verified, documented and stable. You get a post-engagement report with recommendations for ongoing stability.",
  },
];

export default function Process() {
  return (
    <section id="process" className="process styled">
      <div className="process-header">
        <span className="section-eyebrow section-eyebrow--dot">Methodology</span>
        <h2>How We Work</h2>
        <p className="process-subtitle">
          From risk assessment to resolution in three straightforward steps.
        </p>
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