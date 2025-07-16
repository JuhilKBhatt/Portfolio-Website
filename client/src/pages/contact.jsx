// ./client/src/pages/Contact.jsx

import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";
import "../styles/contactPage.css";
import { useContactForm } from "../hooks/useContactForm";

export default function Contact() {
  const [form] = Form.useForm();
  const { onFinish } = useContactForm(form);

  const onFinishFailed = () => {
    message.error("Please check your input and try again.");
  };

  return (
    <div className="contact-page">
      <div className="contact-intro">
        <h1>Get In Touch</h1>
        <p>I’d love to hear from you! Whether you have a question or just want to say hi, feel free to drop a message below.</p>
      </div>
      <div className="contact-divider" />
      <Card title="Contact Me" className="contact-card fade-in-up" variant="borderless">
        <Form
          form={form}
          layout="vertical"
          name="contact-form"
          onFinish={onFinish}
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Message <SendOutlined />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}