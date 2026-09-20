// ./client/src/components/LoadingScreen.jsx

import "../styles/loadingScreen.css";

export default function LoadingScreen({ inline = false }) {
  return (
    <div className={`loading-screen-wrapper ${inline ? "loading-screen-inline" : ""}`}>
      <div className="loader-spinner"></div>
      <div className="loader-text"></div>
    </div>
  );
}