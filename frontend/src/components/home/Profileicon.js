import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthenticationContext.js"; // Import the auth context

export default function Profile({ profilePicture }) {
  const { logout } = useAuth(); // Get the logout method from context

  const handleLogout = () => {
    logout(); // Perform logout
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Profile Thumbnail */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border border-gray-300">
          <img
            src={profilePicture}
            alt="Profile Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <h1 className="text-xl font-bold">Welcome to your profile!</h1>
      <p className="text-gray-600">
        This route is protected and accessible only to authenticated users.
      </p>
    </div>
  );
}

Profile.propTypes = {
  profilePicture: PropTypes.string.isRequired, // Profile picture URL
};
