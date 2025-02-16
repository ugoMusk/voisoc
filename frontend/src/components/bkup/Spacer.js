import React from "react";

export default function Spacer({ size = "md" }) {
  const sizes = {
    sm: "h-2", // Small
    md: "h-4", // Medium
    lg: "h-8", // Large
    xl: "h-12", // Extra Large
  };

  return <div className={sizes[size] || sizes["md"]}></div>;
}
