import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthenticationContext.js";
import axios from "axios";

const baseURL = "http://localhost:5000";

export default function PostForm({ onPostSubmit, theme }) {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState([]);
    const [characterCount, setCharacterCount] = useState(0);
    const { currentUser } = useAuth();
    const maxCharacterLimit = 500;

    const handleContentChange = (e) => {
	const text = e.target.value;
	setContent(text);
	setCharacterCount(text.length);
    };

    const handleMediaUpload = (e) => {
	const files = Array.from(e.target.files);
	setMedia((prev) => [...prev, ...files]);
    };

    const handlePostSubmit = async () => {
	if (content.trim() || media.length > 0) {
	    try {
		// Retrieve and parse userInfo from local storage
		const userInfo = localStorage.getItem("userInfo");
		const user = currentUser || JSON.parse(localStorage.getItem("userInfo"))?.user;
		if (!user || !user.id) {
		    alert("User ID is missing. Please log in again.");
		    return;
		}

		console.log(user.id);
		

		if (!user|| !user.id) {
		    alert("User ID is missing. Please log in again.");
		    return;
		}

		// Extract user ID
		const userId = user.id;

		// Prepare form data for API
		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("content", content || "");
		media.forEach((file) => {
		    formData.append("media[]", file); // Use an array-like key for media
		});

		// Make API call to save the post
		const response = await axios.post(`${baseURL}/create-post`, formData);
		console.log(response);
		console.log(response.data);


		onPostSubmit(response.data); // Pass the saved post to the parent component

		// Reset form state
		setContent("");
		setMedia([]);
		setCharacterCount(0);
		window.location.reload();
	    } catch (error) {
		console.error("Error creating post:", error.message);
		alert("Failed to create post. Please try again.");
	    }
	}
    };

    const removeMedia = (index) => {
	setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    return (
	<div
	    className={`p-4 border rounded-lg shadow-md w-full max-w-lg mx-auto ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
	>
	    <textarea
		className={`w-full p-2 border rounded resize-none focus:outline-none ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-400"
            : "bg-white text-black border-gray-300 focus:ring-blue-500"
        }`}
		rows={4}
		placeholder="What's happening?"
		value={content}
		onChange={handleContentChange}
		maxLength={maxCharacterLimit}
	    ></textarea>
	    <div className="flex justify-between items-center mt-2">
		<div className="flex items-center gap-2">
		    <label
			htmlFor="mediaUpload"
			className={`cursor-pointer ${
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            } hover:underline`}
		    >
			Add Media
		    </label>
		    <input
			type="file"
			id="mediaUpload"
			multiple
			accept="image/*,video/*"
			onChange={handleMediaUpload}
			className="hidden"
		    />
		    <span
			className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
		    >
			{characterCount}/{maxCharacterLimit}
		    </span>
		</div>
		<button
		    className={`px-4 py-2 rounded ${
            content.trim() || media.length > 0
              ? theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
		    onClick={handlePostSubmit}
		    disabled={!content.trim() && media.length === 0}
		>
		    Post
		</button>
	    </div>
	    {media.length > 0 && (
		<div className="mt-4 grid grid-cols-3 gap-2">
		    {media.map((file, index) => (
			<div key={index} className="relative">
			    <img
				src={URL.createObjectURL(file)}
				alt="media preview"
				className="w-full h-24 object-cover rounded"
			    />
			    <button
				className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
				onClick={() => removeMedia(index)}
			    >
				&times;
			    </button>
			</div>
		    ))}
		</div>
	    )}
	</div>
    );
}

PostForm.propTypes = {
    onPostSubmit: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired, // Added theme as required prop
};
