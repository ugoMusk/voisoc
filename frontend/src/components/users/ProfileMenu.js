import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthenticationContext.js";

export default function ProfileMenu({ theme }) {
    const { logout, currentUser } = useAuth();

    // Return statement corrected
    if (!currentUser?.username) {
        return null; // Render nothing if no current user
    }

    return (
        <div className="fixed top-0 z-10 w-full"> {/* Full width and fixed position */}
            <div
                className={`flex flex-row items-center justify-end p-2 rounded-md ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                }`}
            >
                <img
                    src={currentUser?.bio?.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gray-300 px-0.5"
                />
                <button
                    onClick={logout}
                    className="text-xs sm:text-sm md:text-base bg-red-500 text-white px-1 py-1 mx-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

ProfileMenu.propTypes = {
    theme: PropTypes.oneOf(["dark", "light"]).isRequired, // Added theme prop validation
};
