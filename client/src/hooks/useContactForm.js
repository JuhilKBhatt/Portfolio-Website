// ./client/src/hooks/useContactForm.js

import { useState } from "react";
import { message } from "antd";

export function useContactForm(form, options = {}) {
  const { turnstileRef, setTurnstileToken, onSuccess, onError } = options;
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

      // Compile rich transmission body if structured metadata is provided
      let messagePayload = formData.message || "";
      const metaLines = [
        formData.company ? `Company / Organization: ${formData.company}` : null,
        formData.opportunityType ? `Opportunity Type: ${formData.opportunityType}` : null,
        formData.compensation ? `Compensation & Details: ${formData.compensation}` : null,
      ].filter(Boolean);

      if (metaLines.length > 0) {
        messagePayload = [
          ...metaLines,
          "--------------------------------------------------",
          formData.message || "",
        ].join("\n");
      }

      const response = await fetch(contactApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: messagePayload,
          company: formData.company || "",
          opportunityType: formData.opportunityType || "",
          compensation: formData.compensation || "",
          rawMessage: formData.message || "",
          ...(formData.turnstileToken && { "cf-turnstile-response": formData.turnstileToken }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      message.success("Transmission dispatched successfully!");
      if (form && typeof form.resetFields === "function") {
        form.resetFields();
      }
      if (typeof onSuccess === "function") {
        onSuccess();
      }
      return { success: true };
    } catch (err) {
      console.error("Error sending message:", err);
      const errMsg = err.message || "Failed to send message";
      setError(errMsg);
      message.error("Failed to send message. Please try again later.");
      if (typeof onError === "function") {
        onError(err);
      }
      return { success: false, error: errMsg };
    } finally {
      resetTurnstile();
      setIsLoading(false);
    }
  };

  return { onFinish, isLoading, isSuccess, error };
}