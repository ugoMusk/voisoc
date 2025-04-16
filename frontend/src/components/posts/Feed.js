import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthenticationContext.js"; // Import the useAuth hook

const baseURL = process.env.REACT_APP_BASE_URL;

export default function Feed({ theme }) {
    const { isAuthenticated, currentUser } = useAuth(); // Get isAuthenticated from context
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);

    useEffect(() => {
	const fetchPosts = async () => {
	    if (!currentUser) return;

	    try {
		const response = await axios.post(`${baseURL}/get-posts`, {
		    params: { userId: currentUser.id }, // Pass userId as a query parameter
		});

		console.log("Fetched Posts:", response.data);
		
		setPosts(response.data); // Update state with posts from API
		localStorage.setItem("posts", JSON.stringify(response.data)); // Store in localStorage
	    } catch (err) {
		console.error("Error fetching posts:", err);
		setError("Failed to load posts.");
	    } finally {
		setLoading(false);
	    }
	};

	fetchPosts();
    }, [currentUser]);

    // Function to handle post deletion
    const handleDeletePost = (index) => {
	const updatedPosts = posts.filter((_, i) => i !== index);
	setPosts(updatedPosts);
	localStorage.setItem("posts", JSON.stringify(updatedPosts));
    };

    if (!isAuthenticated) {
	return (
	    <Navigate
		to="/login"
		state={{ message: "You need to log in to access posts in your feed!" }}
		replace
	    />
	);
    }

    return (
	<div
	    className={`relative flex flex-col pb-8 mt-2 ${
        theme === "dark" ? "bg-gray-900 text-black" : "bg-gray-100 text-black"
      }`}
	>
	    <h1 className="absolute mt-2 text-blue-700 font-bold">Feed</h1>

	    {loading ? (
		<p>Loading posts...</p>
	    ) : error ? (
		<p className="text-red-500">{error}</p>
	    ) : posts.length === 0 ? (
		<p>No posts yet!</p>
	    ) : (
		<div className="grid grid-cols gap-1 mt-8">
		    {posts.map((post, index) => (
			<div
			    key={post._id}
			    className="flex flex-col p-6 border rounded-lg shadow-md bg-white"
			>
			    {/* Post Content */}
			    <h2 className="text-md mb-1">{post.content}</h2>

			    {/* Post Media */}
			    {post.media && post.media.length > 0 && (
				<div className="grid grid-cols-1 gap-2">
				    {post.media.map((media, idx) => {
					// Check the mimetype of the media to decide how to display it
					if (media.mimetype.startsWith("image")) {
					    return (
						<div key={idx} className="relative">
						    <img
							src={`${baseURL}/uploads/${media.filename}`} // Update with your server's address
						    alt={`Media ${idx}`}
						    className="w-full h-auto rounded-lg shadow-sm"
						    />
						</div>
						    );
					    }
					    return null;
					})}
				     </div>
				    )}

			     {/* Reactions */}
			     <div className="mt-4 flex gap-4">
				 <span>
				     <strong>Likes:</strong> {post.reactions.like}
				 </span>
				 <span>
				     <strong>Love:</strong> {post.reactions.love}
				 </span>
				 <span>
				     <strong>Wow:</strong> {post.reactions.wow}
				 </span>
			     </div>

			     {/* Impressions */}
			     <div className="mt-4">
				 <strong>Impressions:</strong>
				 <ul>
				     {post.impressions.length > 0 ? (
					 post.impressions.map((impression, idx) => (
					     <li key={idx} className="text-sm">{impression}</li>
					 ))
				     ) : (
					 <li>No impressions yet</li>
				     )}
				 </ul>
			     </div>

			     {/* Delete Button */}
			     <button
				 onClick={() => handleDeletePost(index)}
				 className="mb-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			     >
				 Delete Post
			     </button>
			     </div>
			    ))}
		     </div>
		    )}

	     {/* Free Space Yet Div */}
	     <div
		 className={`relative top-0 right-0 h-full flex w-20 items-center justify-center ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        }`}
	     >
		 <p></p>
	     </div>
	     </div>
	    );
    }
