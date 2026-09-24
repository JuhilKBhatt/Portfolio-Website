// ./client/src/pages/Contact.jsx

import React, { useRef, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, UserOutlined, SendOutlined, CheckCircleFilled } from "@ant-design/icons";
import "../styles/contactPage.css";
import { useContactForm } from "../hooks/useContactForm";
import TurnstileWidget from "../components/TurnstileWidget";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY ||
  import.meta.env.VITE_CLOUDFLARE_TRUNSTILE_SITE_KEY;


export default function Contact() {
  const [form] = Form.useForm();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);

  const name = Form.useWatch("name", form);
  const email = Form.useWatch("email", form);
  const userMessage = Form.useWatch("message", form);

  const isDataEntered = Boolean(name?.trim() && email?.trim() && userMessage?.trim());
  const isSubmitDisabled = !isDataEntered || Boolean(TURNSTILE_SITE_KEY && !turnstileToken);

  const { onFinish, isLoading, isSuccess } = useContactForm(form, {
    turnstileRef,
    setTurnstileToken,
  });

  const onFinishFailed = () => {
    message.error("Please check your input and try again.");
  };

  const handleFormSubmit = (values) => {
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      message.error("Please complete the verification challenge before sending.");
      return;
    }
    onFinish({
      ...values,
      turnstileToken,
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-intro">
        <h1>Get In Touch</h1>
        <p>I'd love to hear from you! Whether you have a question or just want to say hi, feel free to drop a message below.</p>
      </div>
      <div className="contact-divider" />
      <Card title="Contact Me" className="contact-card fade-in-up" variant="borderless">
        <Form
          form={form}
          layout="vertical"
          name="contact-form"
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
          className="contact-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name." }]}
          >
            <Input placeholder="Your name" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Enter a valid email address." },
            ]}
          >
            <Input placeholder="you@example.com" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter a message." }]}
          >
            <Input.TextArea rows={4} placeholder="Type your message here..." />
          </Form.Item>

          {TURNSTILE_SITE_KEY && (
            <TurnstileWidget
              ref={turnstileRef}
              siteKey={TURNSTILE_SITE_KEY}
              action="contact"
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          )}

          <Form.Item className="contact-submit-item">
            <div className="contact-submit-row">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={isSubmitDisabled}
                className="contact-submit-btn"
              >
                Send Message <SendOutlined />
              </Button>
              {isSuccess && (
                <div className="contact-success-notification fade-in">
                  <CheckCircleFilled className="success-icon" />
                  <span>Message sent successfully! I will get in touch soon.</span>
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}