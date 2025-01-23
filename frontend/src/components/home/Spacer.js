import React from "react";
import PropTypes from "prop-types";

export default function Spacer({ size = "md" }) {
  const sizes = {
    sm: "h-2", // Small
    md: "h-4", // Medium
    lg: "h-8", // Large
    xl: "h-12", // Extra Large
  };

  return <div className={sizes[size] || sizes["md"]}></div>;
}

Spacer.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]), // Only allow these size values
};

Spacer.defaultProps = {
  size: "md", // Default size is medium if not provided
};
