"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      // slightly higher on the page
      containerStyle={{ top: 48 }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "16px",
          border: "1px solid #d7efe3",
          background: "#ffffff",
          color: "#264f41",
          fontFamily: "Manrope, sans-serif",
          fontWeight: "700",
          boxShadow: "0 10px 25px rgba(38, 79, 65, 0.12)",
          maxWidth: "380px",
          padding: "14px 18px",
          minHeight: "64px",
        },
        success: {
          iconTheme: {
            primary: "#3ca779",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#b42318",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}