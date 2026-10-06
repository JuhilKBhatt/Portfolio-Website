// ./client/src/components/DispatchContactForm.jsx

import React, { useState, useRef, useId } from "react";
import PropTypes from "prop-types";
import { LockOutlined, ThunderboltFilled, SendOutlined, CheckCircleFilled } from "@ant-design/icons";
import { message } from "antd";
import "../styles/dispatchContactForm.css";
import { useContactForm } from "../hooks/useContactForm";
import TurnstileWidget from "./TurnstileWidget";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY ||
  import.meta.env.VITE_CLOUDFLARE_TRUNSTILE_SITE_KEY;

const DEFAULT_OPPORTUNITY_TYPES = [
  "Full-time Software Engineer",
  "Contract / Consulting",
  "Internship",
  "Other / General Inquiry",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * DispatchContactForm - Reusable, dynamic terminal/cyberpunk contact outreach form.
 * Connects directly to the existing AWS Lambda / API Gateway serverless contact pipeline.
 */
export default function DispatchContactForm({
  securityTag = "END-TO-END ENCRYPTED",
  defaultOpportunityType = "Full-time Staff / Principal Role",
  opportunityTypes = DEFAULT_OPPORTUNITY_TYPES,
  noticeLabel = "Typical response time is under 2 business days",
  noticeText = "",
  submitText = "Send Message",
  initialValues = {},
  onSuccess,
  onError,
  className = "",
  style = {},
}) {
  const formId = useId();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);

  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    company: initialValues.company || "",
    email: initialValues.email || "",
    opportunityType: initialValues.opportunityType || defaultOpportunityType,
    compensation: initialValues.compensation || "",
    message: initialValues.message || "",
  });

  const [touched, setTouched] = useState({});
  const [dispatchId, setDispatchId] = useState("");

  const { onFinish, isLoading, isSuccess } = useContactForm(null, {
    turnstileRef,
    setTurnstileToken,
    onSuccess: () => {
      const generatedId = `TX-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
      setDispatchId(generatedId);
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    },
    onError,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Your name is required.";
    if (!formData.company.trim()) newErrors.company = "Company / organization is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Work email is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid work email address.";
    }
    if (!formData.opportunityType) newErrors.opportunityType = "Opportunity type is required.";
    if (!formData.message.trim()) newErrors.message = "Message or JD URL is required.";
    return newErrors;
  };

  const errors = validate();
  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitDisabled = hasErrors || Boolean(TURNSTILE_SITE_KEY && !turnstileToken);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      company: true,
      email: true,
      opportunityType: true,
      compensation: true,
      message: true,
    });

    if (hasErrors) {
      message.error("Please fill in all required fields marked with *.");
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      message.error("Please complete the verification challenge before transmitting.");
      return;
    }

    onFinish({
      ...formData,
      turnstileToken,
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      opportunityType: defaultOpportunityType,
      compensation: "",
      message: "",
    });
    setTouched({});
    setDispatchId("");
    if (turnstileRef.current?.reset) {
      turnstileRef.current.reset();
    }
    setTurnstileToken("");
  };

  return (
    <div className={`dispatch-form-card ${className}`.trim()} style={style}>
      {/* Main Content Area */}
      {isSuccess && dispatchId ? (
        <div className="dispatch-success-view">
          <div className="dispatch-success-icon-wrapper">
            <CheckCircleFilled className="dispatch-success-icon" />
          </div>
          <h3 className="dispatch-success-title">Transmission Confirmed</h3>
          <p className="dispatch-success-desc">
            Your outreach has been dispatched to recruiter triage. Typical response time is under 4 business hours.
          </p>

          <div className="dispatch-success-meta">
            <div className="dispatch-success-meta-row">
              <span className="dispatch-meta-key">DISPATCH_ID:</span>
              <span className="dispatch-meta-val">{dispatchId}</span>
            </div>
            <div className="dispatch-success-meta-row">
              <span className="dispatch-meta-key">STATUS:</span>
              <span className="dispatch-meta-val status-ok">200 DELIVERED</span>
            </div>
            <div className="dispatch-success-meta-row">
              <span className="dispatch-meta-key">RECIPIENT:</span>
              <span className="dispatch-meta-val">Juhil K. Bhatt</span>
            </div>
            <div className="dispatch-success-meta-row">
              <span className="dispatch-meta-key">PIPELINE:</span>
              <span className="dispatch-meta-val">AWS Serverless Triage</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="dispatch-reset-btn"
          >
            Dispatch Another Transmission
          </button>
        </div>
      ) : (
        <form className="dispatch-body" onSubmit={handleSubmit} noValidate>
          {/* Row 1: Name & Company */}
          <div className="dispatch-form-row">
            <div className="dispatch-form-group">
              <label htmlFor={`${formId}-name`} className="dispatch-label">
                Your Name <span className="dispatch-required">*</span>
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. John Doe"
                className={`dispatch-input ${touched.name && errors.name ? "is-invalid" : ""}`.trim()}
                required
              />
              {touched.name && errors.name && (
                <span className="dispatch-error-text">{errors.name}</span>
              )}
            </div>

            <div className="dispatch-form-group">
              <label htmlFor={`${formId}-company`} className="dispatch-label">
                Company / Organisation <span className="dispatch-required">*</span>
              </label>
              <input
                id={`${formId}-company`}
                name="company"
                type="text"
                autoComplete="organisation"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Google, Meta, Apple"
                className={`dispatch-input ${touched.company && errors.company ? "is-invalid" : ""}`.trim()}
                required
              />
              {touched.company && errors.company && (
                <span className="dispatch-error-text">{errors.company}</span>
              )}
            </div>
          </div>

          {/* Row 2: Work Email */}
          <div className="dispatch-form-group">
            <label htmlFor={`${formId}-email`} className="dispatch-label">
              Work Email <span className="dispatch-required">*</span>
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="john.doe@company.com"
              className={`dispatch-input ${touched.email && errors.email ? "is-invalid" : ""}`.trim()}
              required
            />
            {touched.email && errors.email && (
              <span className="dispatch-error-text">{errors.email}</span>
            )}
          </div>

          {/* Row 3: Opportunity Type */}
          <div className="dispatch-form-group">
            <label htmlFor={`${formId}-opportunity`} className="dispatch-label">
              Opportunity Type <span className="dispatch-required">*</span>
            </label>
            <select
              id={`${formId}-opportunity`}
              name="opportunityType"
              value={formData.opportunityType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`dispatch-select ${touched.opportunityType && errors.opportunityType ? "is-invalid" : ""}`.trim()}
              required
            >
              {opportunityTypes.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Compensation & Details */}
          <div className="dispatch-form-group">
            <div className="dispatch-label-row">
              <label htmlFor={`${formId}-compensation`} className="dispatch-label">
                Role Compensation & Details <span className="dispatch-optional">(Optional)</span>
              </label>
              <span className="dispatch-label-hint">Message Heading</span>
            </div>
            <input
              id={`${formId}-compensation`}
              name="compensation"
              type="text"
              value={formData.compensation}
              onChange={handleChange}
              placeholder="e.g. Staff Software Engineer, Base $70k - $80k + Super, Hybrid or Remote"
              className="dispatch-input"
            />
          </div>

          {/* Row 5: Message / JD URL */}
          <div className="dispatch-form-group">
            <label htmlFor={`${formId}-message`} className="dispatch-label">
              Message / Job Description URL <span className="dispatch-required">*</span>
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Paste JD overview, architecture challenge, or direct context for our sync..."
              className={`dispatch-textarea ${touched.message && errors.message ? "is-invalid" : ""}`.trim()}
              required
            />
            {touched.message && errors.message && (
              <span className="dispatch-error-text">{errors.message}</span>
            )}
          </div>

          {/* Cloudflare Turnstile if site key configured */}
          {TURNSTILE_SITE_KEY && (
            <div className="dispatch-turnstile-container">
              <TurnstileWidget
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                action="contact"
                theme="dark"
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
              />
            </div>
          )}

          {/* Notice Callout Box */}
          <div className="dispatch-notice-box">
            <ThunderboltFilled className="dispatch-notice-icon" />
            <p className="dispatch-notice-text">
              <strong>{noticeLabel}</strong> {noticeText}
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled || isLoading}
            className="dispatch-submit-btn"
          >
            {isLoading ? (
              <>
                <span className="dispatch-spinner" aria-hidden="true" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <SendOutlined className="dispatch-submit-icon" />
                <span>{submitText}</span>
              </>
            )}
            <div className="dispatch-security-row">
              <LockOutlined className="dispatch-security-icon" />
              <span>{securityTag}</span>
            </div>
          </button>
        </form>
      )}
    </div>
  );
}

DispatchContactForm.propTypes = {
  title: PropTypes.string,
  securityTag: PropTypes.string,
  defaultOpportunityType: PropTypes.string,
  opportunityTypes: PropTypes.arrayOf(PropTypes.string),
  noticeLabel: PropTypes.string,
  noticeText: PropTypes.string,
  submitText: PropTypes.string,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    company: PropTypes.string,
    email: PropTypes.string,
    opportunityType: PropTypes.string,
    compensation: PropTypes.string,
    message: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};
