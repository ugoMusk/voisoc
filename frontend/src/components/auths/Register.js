import React, { useState } from "react";
import PropTypes from "prop-types";
import countries from "./countries.js";
import { useAuth } from "../contexts/AuthenticationContext.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register({profilePicture, onRegisterSuccess, onRegisterError }) {
    const { register } = useAuth();
    const navigate = useNavigate(); // Use React Router's useNavigate hook
    const [formData, setFormData] = useState({
	email: "",
	username: "",
	password: "",
	firstname: "",
	middlename: "",
	lastname: "",
	country: "",
    });
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const validateEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
    };

    const validatePasswordStrength = (password) => {
	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
	return passwordRegex.test(password);
    };

    const sanitizeInput = (input) => input.trim();

    const handleInputChange = (e) => {
	const { name, value } = e.target;
	setFormData((prev) => ({
	    ...prev,
	    [name]: sanitizeInput(value),
	}));
    };

    const handleSubmit = async (e) => {
	e.preventDefault();

	// Reset error messages and success message
	setEmailError("");
	setPasswordError("");
	setSuccessMessage("");

	if (!validateEmail(formData.email)) {
	    setEmailError("Please enter a valid email address.");
	    return;
	}

	if (!validatePasswordStrength(formData.password)) {
	    setPasswordError(
		"Password must be at least 8 characters, contain at least one uppercase letter, and one number."
	    );
	    return;
	}

	try {
	    const response = await register(formData);

	    // Display success message after registration is successful
	    setSuccessMessage("Registration successful! Redirecting to login...");

	    // Reset form fields
	    setFormData({
		email: "",
		username: "",
		password: "",
		firstname: "",
		middlename: "",
		lastname: "",
		country: "",
	    });

	    // Call the onRegisterSuccess callback
	    if (onRegisterSuccess) onRegisterSuccess(response);

	    // Redirect to login after 2 seconds
	    setTimeout(() => {
		navigate("/login");
	    }, 2000);
	} catch (error) {
	    console.error("Error registering:", error.response ? error.response.data.error : error.message);
	    alert("Registration failed. Please try again.");

	    // Call the onRegisterError callback
	    if (onRegisterError) onRegisterError(error);
	}
    };

    return (
	<div className="min-h-screen flex items-center justify-center bg-gray-50">
	    <form
		onSubmit={handleSubmit}
		className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
	    >
		<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

		{successMessage && (
		    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
			{successMessage}
		    </div>
		)}

		{/* Email Input */}
		<div className="mb-4">
		    <label
			htmlFor="email"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Email
		    </label>
		    <input
			type="email"
			id="email"
			name="email"
			value={formData.email}
			onChange={(e) => {
			    handleInputChange(e);
			    setEmailError("");
			}}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>
		{emailError && (
		    <p className="text-red-500 text-xs italic">{emailError}</p>
		)}

		{/* Username Input */}
		<div className="mb-4">
		    <label
			htmlFor="username"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Username
		    </label>
		    <input
			type="text"
			id="username"
			name="username"
			value={formData.username}
			onChange={handleInputChange}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>

		{/* Password Input */}
		<div className="mb-4">
		    <label
			htmlFor="password"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Password
		    </label>
		    <input
			type="password"
			id="password"
			name="password"
			value={formData.password}
			onChange={(e) => {
			    handleInputChange(e);
			    setPasswordError("");
			}}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>
		{passwordError && (
		    <p className="text-red-500 text-xs italic">{passwordError}</p>
		)}

		{/* First Name Input */}
		<div className="mb-4">
		    <label
			htmlFor="firstname"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			First Name
		    </label>
		    <input
			type="text"
			id="firstname"
			name="firstname"
			value={formData.firstname}
			onChange={handleInputChange}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>

		{/* Middle Name Input */}
		<div className="mb-4">
		    <label
			htmlFor="middlename"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Middle Name
		    </label>
		    <input
			type="text"
			id="middlename"
			name="middlename"
			value={formData.middlename}
			onChange={handleInputChange}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>

		{/* Last Name Input */}
		<div className="mb-4">
		    <label
			htmlFor="lastname"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Last Name
		    </label>
		    <input
			type="text"
			id="lastname"
			name="lastname"
			value={formData.lastname}
			onChange={handleInputChange}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    />
		</div>

		{/* Country Input */}
		<div className="mb-4">
		    <label
			htmlFor="country"
			className="block text-sm font-bold mb-2 text-gray-700"
		    >
			Country
		    </label>
		    <select
			id="country"
			name="country"
			value={formData.country}
			onChange={handleInputChange}
			className="shadow border rounded w-full py-2 px-3 text-gray-700"
		    >
			<option value="">Select Country</option>
			{countries.map((countryOption) => (
			    <option key={countryOption.code} value={countryOption.code}>
				{countryOption.name}
			    </option>
			))}
		    </select>
		</div>

		{/* Submit Button */}
		<div className="flex items-center justify-between">
		    <button
			type="submit"
			className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		    >
			Register
		    </button>
		</div>

		{/* Login Link */}
		<div className="mt-4 text-center">
		    <p className="text-sm text-gray-600">
			Already have an account?{" "}
			<Link to="/login" className="text-blue-500 hover:text-blue-700">
			    Login here
			</Link>
		    </p>
		</div>
	    </form>
	</div>
    );
}

Register.propTypes = {
    onRegisterSuccess: PropTypes.func,
    onRegisterError: PropTypes.func,
};
