import React from "react";
import PropTypes from "prop-types";
import { FaMoon } from "react-icons/fa"; // Import the moon icon from react-icons

export default function ThemeToggleButton({ theme, toggleTheme }) {
  return (
    <div className="fixed mt-2 z-20 top-3 left-1/2 transform -translate-x-1/2">
      <button
        onClick={toggleTheme}
        className={`flex items-center justify-center bg-transparent border-none cursor-pointer text-xl p-1 rounded-full 
                    ${theme === "dark" ? "bg-black text-white border-white" : "bg-white text-black border-black"}
                    border-2`}
        aria-label="Toggle theme"
      >
        <FaMoon
          className={`h-3 w-3 ${theme === "dark" ? "stroke-white" : "stroke-black"}`}
          style={{
            strokeWidth: 1.5, // Defines the outline thickness
          }}
        />
      </button>
    </div>
  );
}

ThemeToggleButton.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]).isRequired, // Ensures theme is "light" or "dark"
  toggleTheme: PropTypes.func.isRequired, // Ensures toggleTheme is passed as a function
};
