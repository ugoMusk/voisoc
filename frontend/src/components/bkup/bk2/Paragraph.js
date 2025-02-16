import React from "react";

export default function ResponsiveParagraph({ text }) {
  return (
      <p className="text-justify outline-1 bg-blue text-gray-80 dark:text-gray-200 font-roboto text-sm md:text-base leading-relaxed"
      style={{ whiteSpace: "pre-wrap" }} >
      {text}
    </p>
  );
}
