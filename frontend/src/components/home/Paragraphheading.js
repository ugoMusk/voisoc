import React from "react";
import PropTypes from "prop-types";

export default function ResponsiveHeading({ text, theme }) {
  const textColor = theme === "dark" ? "text-gray-900" : "text-gray-200";
  const hrColor = theme === "dark" ? "bg-gray-400" : "bg-gray-300";

  return (
    <div>
      <p
        className={`uppercase text-left md:text-left font-bold leading-snug mb-4 mt-4 ${textColor}`}
      >
        {text}
      </p>
      <hr className={`h-px my-8 border-0 ${hrColor} mt-0 mb-2`} />
    </div>
  );
}

// Define PropTypes
ResponsiveHeading.propTypes = {
  text: PropTypes.string.isRequired, // Ensures `text` is a required string
  theme: PropTypes.oneOf(["light", "dark"]).isRequired, // Ensures `theme` is either "light" or "dark"
};
