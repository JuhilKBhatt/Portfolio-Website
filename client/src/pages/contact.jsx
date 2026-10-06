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
          title="Direct Outreach & Dispatch"
          subtitle="Send project proposals, hiring opportunities, or direct technical inquiries. Messages submit directly through the AWS serverless triage pipeline."
          meta="AWS SERVERLESS TRIAGE"
        />
        <DispatchContactForm />
      </div>
    </div>
  );
}