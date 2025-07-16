// ./client/src/hooks/useContactForm.js

import { message } from "antd";
import axios from "axios";

export function useContactForm(form) {
  const onFinish = async (values) => {
    try {
      await axios.post(
        import.meta.env.VITE_FLASK_API_URL + "/api/contact",
        values
      );
      message.success("Message sent successfully!");
      form.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message. Please try again later.");
    }
  };

  return { onFinish };
}