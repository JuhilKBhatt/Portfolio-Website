// ./client/src/components/RouteProgressBar.jsx

import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../styles/routeProgressBar.css";

/**
 * RouteProgressBar - Subtle neon-orange glowing progress bar (like GitHub / YouTube)
 * that animates across the top of the viewport whenever the user navigates to a new page.
 */
export default function RouteProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const isFirstMount = useRef(true);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    // Reset viewport scroll to top on every route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Skip animation on first load paint
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    clearTimers();
    setVisible(true);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(65);
    }, 80);

    const t2 = setTimeout(() => {
      setProgress(88);
    }, 180);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 280);

    const t4 = setTimeout(() => {
      setVisible(false);
    }, 450);

    const t5 = setTimeout(() => {
      setProgress(0);
    }, 650);

    timersRef.current = [t1, t2, t3, t4, t5];

    return () => {
      clearTimers();
    };
  }, [location.pathname, location.search, location.hash]);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div className="route-progress-bar-container" aria-hidden="true">
      <div
        className="route-progress-bar-fill"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
