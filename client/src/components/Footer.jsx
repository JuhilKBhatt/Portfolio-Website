// ./client/src/components/Footer.jsx

import React from "react";
import { GithubOutlined, LinkedinOutlined, MailOutlined } from "@ant-design/icons";
import "../styles/customFooter.css";

export default function FooterComponent() {
  return (
    <footer className="footerStyle">
      <div className="footer-container">
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href={import.meta.env.VITE_GITHUB_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
          >
            <GithubOutlined />
            <span>GitHub</span>
          </a>
          <a
            href={import.meta.env.VITE_LINKEDIN_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-linkedin-link"
          >
            <LinkedinOutlined />
            <span>LinkedIn</span>
          </a>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-email-link"
          >
            <MailOutlined />
            <span>Email</span>
          </a>
        </div>
        <span className="footer-text">
          © {new Date().getFullYear()} Juhil Kalpeshkumar Bhatt. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}