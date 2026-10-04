// ./client/src/components/Footer.jsx

import React from "react";
import { GithubOutlined, LinkedinOutlined, MailOutlined } from "@ant-design/icons";
import "../styles/customFooter.css";

export default function FooterComponent() {
  return (
    <footer className="footerStyle">
      <div className="footer-container">
        <span className="footer-text">
          © {new Date().getFullYear()} JUHIL K BHATT. SELF DESIGNED, BUILT & HOMELAB DEPLOYED.
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href={import.meta.env.VITE_GITHUB_URL || "#"}
            className="footer-github-link"
          >
            <GithubOutlined />
            <span>GITHUB</span>
          </a>
          <a
            href={import.meta.env.VITE_LINKEDIN_URL || "#"}
            className="footer-linkedin-link"
          >
            <LinkedinOutlined />
            <span>LINKEDIN</span>
          </a>
          <a
            href="/contact"
            className="footer-email-link"
          >
            <MailOutlined />
            <span>EMAIL</span>
          </a>
        </div>
      </div>
    </footer>
  );
}