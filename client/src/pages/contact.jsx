// ./client/src/pages/Contact.jsx

import React from "react";
import "../styles/contactPage.css";
import DispatchContactForm from "../components/DispatchContactForm";

export default function Contact() {
  return (
    <div className="contact-page fade-in-up">
      <div className="contact-intro">
        <h1>Direct Outreach &amp; Dispatch</h1>
        <p>
          Send project proposals, hiring opportunities, or direct technical inquiries.
          Messages submit directly through the AWS serverless triage pipeline.
        </p>
      </div>
      <div className="contact-divider" />
      <div className="contact-form-container">
        <DispatchContactForm />
      </div>
    </div>
  );
}