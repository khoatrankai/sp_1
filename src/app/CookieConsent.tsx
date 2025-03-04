"use client";

import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu người dùng đã chấp nhận cookie
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#333",
        color: "#fff",
        padding: "1rem",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p>
        This website uses cookies to enhance the user experience.{" "}
        <a href="#" style={{ color: "#4caf50" }}>
          Learn more
        </a>
      </p>
      <button
        onClick={acceptCookies}
        style={{
          margin: "0 10px",
          padding: "0.5rem 1rem",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        I understand
      </button>
    </div>
  );
}
