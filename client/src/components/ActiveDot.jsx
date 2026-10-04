// ./client/src/components/ActiveDot.jsx

import React from "react";
import PropTypes from "prop-types";
import "../styles/activeDot.css";

/**
 * ActiveDot - High-performance, GPU-accelerated CSS animated status dot.
 * Completely modular and callable across any component or layout.
 *
 * @param {string} [color="blue"] - Preset ("blue" | "green") or custom hex/rgb/hsl color (e.g. "#22D3EE")
 * @param {"sm"|"md"|"lg"|number} [size="sm"] - Size preset or exact pixel number
 * @param {boolean} [pulse=true] - Whether to show the breathing/radar ping wave
 * @param {string} [className=""] - Additional custom classes
 * @param {object} [style={}] - Inline styles
 * @param {React.ReactNode} [children] - Optional label to render beside the dot
 */
export default function ActiveDot({
  color = "blue",
  size = "sm",
  pulse = true,
  className = "",
  style = {},
  children,
  ...props
}) {
  const isPresetSize = ["sm", "md", "lg"].includes(size);
  const sizeClass = isPresetSize ? `active-dot--${size}` : "";

  const isCustomColor =
    typeof color === "string" &&
    (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl"));

  const colorClass = isCustomColor ? "" : `active-dot--${color}`;
  const pulseClass = pulse ? "active-dot--pulse" : "";

  const customStyle = {
    ...style,
    ...(isCustomColor
      ? {
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }
      : {}),
    ...(typeof size === "number" || (!isPresetSize && size)
      ? {
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
        }
      : {}),
  };

  const dot = (
    <span
      className={`active-dot ${colorClass} ${sizeClass} ${pulseClass} ${className}`.trim()}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );

  if (children) {
    return (
      <span className="active-dot-wrapper">
        {dot}
        <span className="active-dot-label">{children}</span>
      </span>
    );
  }

  return dot;
}

ActiveDot.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pulse: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};
