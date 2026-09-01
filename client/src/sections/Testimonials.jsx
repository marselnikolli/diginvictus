import React, { useState } from "react";

export default function Testimonials({ testimonials }) {
  const active = (testimonials || []).filter((t) => t.active);
  const [index, setIndex] = useState(0);

  if (active.length === 0) return null;
  const current = active[Math.min(index, active.length - 1)];

  return (
    <section className="clients-testimonials styled">
      <div className="-box">
        <div className="-content">
          <p>“{current.quote}”</p>
        </div>
        <div className="-meta">
          <h5>{current.author}</h5>
          <p>
            {[current.role, current.company].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
      <div className="-controls">
        <button
          type="button"
          className="slick-prev"
          onClick={() => setIndex((index - 1 + active.length) % active.length)}
          aria-label="Previous testimonial"
        >
          Prev
        </button>
        <ul className="slick-dots">
          {active.map((t, i) => (
            <li
              key={t.id}
              className={i === index ? "slick-active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </ul>
        <button
          type="button"
          className="slick-next"
          onClick={() => setIndex((index + 1) % active.length)}
          aria-label="Next testimonial"
        >
          Next
        </button>
      </div>
    </section>
  );
}
