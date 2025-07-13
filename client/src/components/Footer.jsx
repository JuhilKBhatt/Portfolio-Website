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
            href="https://github.com/JuhilKBhatt"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github-link"
          >
            <GithubOutlined />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/juhil-bhatt-746b08374?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BNBUHUyNDRPiu8Yek3kTkgA%3D%3D"
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