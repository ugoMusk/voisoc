import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useAuth } from "../contexts/AuthenticationContext.js"; // Import the AuthContext hook
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate

const baseURL = "http://localhost:5000";

export default function Login() {
    const { login } = useAuth(); // Use login method from AuthContext
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation(); // Access location state
    const navigate = useNavigate(); // Hook for programmatic navigation
    const redirectMessage = location.state?.message; // Get the redirect message

    const handleSubmit = async (e) => {
	e.preventDefault();
	try {
            // Send login request
            const response = await axios.post(
		`${baseURL}/login`,
		{ email, password },
		{ withCredentials: true }
            );

            alert("Login successful");
            console.log("Login frontend session data; ", response.data);

            const sessionData = 
		  typeof response.data.sessionData === "string"
                  ? JSON.parse(response.data)
                  : response.data;

            const tokenId = sessionData.sessionId;
            if (!tokenId) {
		throw new Error("Login token missing");
            }
            console.log("TokenId extracted: ", tokenId);

            // Request user info using the token from the login response
            const userInfo = await axios.post(
		`${baseURL}/account`,
		{ username: sessionData.user.username, sessionId: tokenId },
		{ withCredentials: true }
            );
            console.log("User Info from login: ", userInfo);

            // Extract the username from the user info object
            const username = userInfo.data.username;
            console.log("User name from login: ", username);

            // Save username to localStorage
            localStorage.setItem("username", username);
            localStorage.setItem("sessionId", tokenId);

            // Use AuthContext to set user data and persist session
            await login(userInfo.data, tokenId);

            // Redirect user to the profile page
            navigate(`/profile?username=${username}`);
	    window.location.reload();
	} catch (error) {
            console.error("Error logging in:", error.response ? error.response.data : error.message);
            alert("Login failed. Please try again.");
	}
    };


    return (
        <div className="min-h-screen z-12 flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <h2 className="text-2xl font-bold mb-6">Login</h2>

                {/* Display redirect message if it exists */}
                {redirectMessage && (
                    <p className="text-red-500 text-center mb-4">{redirectMessage}</p>
                )}

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                </div>

                {/* Paragraph with signup link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-black">
                        Don't have an account yet?{" "}
                        <Link
                            to="/register"
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

// Define PropTypes
Login.propTypes = {};
