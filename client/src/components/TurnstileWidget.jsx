// ./client/src/components/TurnstileWidget.jsx

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const TurnstileWidget = forwardRef(function TurnstileWidget(
  {
    siteKey,
    action = "contact",
    onVerify,
    onExpire,
    onError,
    theme = "auto",
  },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbacksRef = useRef({ onVerify, onExpire, onError });

  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire, onError };
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.warn("Turnstile reset error:", err);
        }
      }
    },
    getResponse: () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          return window.turnstile.getResponse(widgetIdRef.current);
        } catch {
          return null;
        }
      }
      return null;
    },
  }));

  useEffect(() => {
    if (!siteKey) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: action,
          theme: theme,
          callback: (token) => {
            if (isMounted && callbacksRef.current.onVerify) {
              callbacksRef.current.onVerify(token);
            }
          },
          "expired-callback": () => {
            if (isMounted && callbacksRef.current.onExpire) {
              callbacksRef.current.onExpire();
            }
          },
          "error-callback": (error) => {
            if (isMounted && callbacksRef.current.onError) {
              callbacksRef.current.onError(error);
            }
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error("Turnstile render error:", err);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          renderWidget();
        }
      }, 100);

      return () => {
        isMounted = false;
        clearInterval(checkTurnstile);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      };
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey, action, theme]);

  if (!siteKey) return null;

  return (
    <div className="turnstile-wrapper">
      <div ref={containerRef} className="cf-turnstile-container" />
    </div>
  );
});

export default TurnstileWidget;
