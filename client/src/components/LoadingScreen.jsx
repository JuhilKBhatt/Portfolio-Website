// ./client/src/components/LoadingScreen.jsx

import "../styles/loadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen-wrapper">
      <div className="loader-spinner"></div>
      <div className="loader-text"></div>
    </div>
  );
}