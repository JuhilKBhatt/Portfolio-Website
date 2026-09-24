// ./client/src/hooks/useContactForm.js

import { useState } from "react";
import { message } from "antd";

export function useContactForm(form, options = {}) {
  const { turnstileRef, setTurnstileToken } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const resetTurnstile = () => {
    if (turnstileRef?.current?.reset) {
      turnstileRef.current.reset();
    }
    if (setTurnstileToken) {
      setTurnstileToken("");
    }
  };

  const onFinish = async (formData) => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const contactApiUrl = import.meta.env.VITE_CONTACT_API_URL;
      if (!contactApiUrl) {
        throw new Error("Contact API URL is not configured in environment variables.");
      }

      const response = await fetch(contactApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          ...(formData.turnstileToken && { "cf-turnstile-response": formData.turnstileToken }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      message.success("Message sent successfully!");
      if (form && typeof form.resetFields === "function") {
        form.resetFields();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message");
      message.error("Failed to send message. Please try again later.");
    } finally {
      resetTurnstile();
      setIsLoading(false);
    }
  };

  return { onFinish, isLoading, isSuccess, error };
}