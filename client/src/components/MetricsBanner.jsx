// ./client/src/components/MetricsBanner.jsx

import React from "react";
import "../styles/metricsBanner.css";

/**
 * MetricsBanner - Data-driven stats strip.
 *
 * @param {Array<{label: string, value: string, description?: string, color?: string}>} metrics
 *   Each item renders one column. `color` overrides the value colour
 *   (defaults alternate between accent peach and light grey).
 * @param {string} [className=""] - Extra classes for the outer banner.
 */
export default function MetricsBanner({ metrics = [], className = "" }) {
  if (!metrics.length) return null;

  return (
    <section className={`metrics-banner ${className}`.trim()} aria-label="Key metrics">
      <dl className="metrics-banner-grid">
        {metrics.map(({ label, value, description, color }) => (
          <div className="metrics-banner-item" key={label}>
            <dt className="metrics-banner-label">{label}</dt>
            <dd className="metrics-banner-value" style={color ? { color } : undefined}>
              {value}
            </dd>
            {description && <dd className="metrics-banner-desc">{description}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
