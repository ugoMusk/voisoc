import React from "react";
import PropTypes from "prop-types";

export default function ResponsiveParagraph({ text, theme }) {
  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-300";

  return (
    <p
      className={`text-justify font-bold outline-1 bg-blue font-roboto text-md md:text-base leading-relaxed ${textColor}`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      {text}
    </p>
  );
}

// Define PropTypes
ResponsiveParagraph.propTypes = {
  text: PropTypes.string.isRequired, // Ensures `text` is a required string
  theme: PropTypes.oneOf(["light", "dark"]).isRequired, // Ensures `theme` is either "light" or "dark"
};
