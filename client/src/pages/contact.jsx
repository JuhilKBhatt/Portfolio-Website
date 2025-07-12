// ./client/src/pages/Contact.jsx

import axios from "axios";
import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";
import "../styles/contactPage.css";

export default function Contact() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      message.success("Message sent successfully!");
      await axios.post(import.meta.env.VITE_FLASK_API_URL+"/api/contact", values)
      form.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message. Please try again later.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please check your input and try again.");
  };

  return (
    <div>
      <Card
        title="Contact Me"
        variant="borderless"
        style={{
          maxWidth: 600,
          margin: "auto",
          marginTop: 50,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          borderRadius: 12,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="contact-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            <Input.TextArea
              rows={4}
              placeholder="Type your message here..."
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Message <SendOutlined/>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}