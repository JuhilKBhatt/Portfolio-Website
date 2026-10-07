// ./client/src/pages/Contact.jsx

import React from "react";
import "../styles/contactPage.css";
import DispatchContactForm from "../components/DispatchContactForm";
import PageTitle from "../components/PageTitle";

export default function Contact() {
  return (
    <div className="contact-page fade-in-up">
      <div className="contact-form-container">
        <PageTitle
          tag="DISPATCH"
          title="Get In Touch"
          subtitle="I'd love to hear from you! Whether you have a question or just want to say hi, feel free to drop a message below."
          meta="AWS SERVERLESS TRIAGE"
        />
        <DispatchContactForm />
      </div>
    </div>
  );
}