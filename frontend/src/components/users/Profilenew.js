import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthenticationContext.js";
import { getUserList } from "./utils/user_list.js";
import axios from "axios";

const baseURL = "http://localhost:5000";

export default function Profile({ profilePicture, theme }) {
    const { logout } = useAuth();
    const location = useLocation(); // Get the location object to access the query string

    const [userInfo, setUserInfo] = useState(null);
    const [usersToFollow, setUsersToFollow] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to extract query parameters
    const getQueryParams = (query) => {
        return new URLSearchParams(query);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);

                const queryParams = getQueryParams(location.search); // Extract query params
                const username = queryParams.get("username"); // Get the "username" query parameter
                console.log("Extracted username from query:", username);

                if (!username) {
                    throw new Error("Username parameter is missing in the query string.");
                }

                // Fetch the user list
                const userList = await getUserList();
                console.log("Resolved user list:", userList);

                // Find the user that matches the username from the query string
                const matchedUser = userList.find((item) => item.user.username === username);

                if (!matchedUser) {
                    throw new Error(`User with username "${username}" not found.`);
                }

                // Fetch additional profile data for the matched user
                const response = await axios.post(
                    `${baseURL}/profile`,
                    { username: matchedUser.user.username },
                    { withCredentials: true }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch user data");
                }

                setUserInfo(response.data);

                // Filter other users to recommend for "users to follow"
                const usersToFollowList = userList
                    .filter(({ user }) => user.username !== matchedUser.user.username)
                    .map(({ user }) => user); // Extract only the user object
                setUsersToFollow(usersToFollowList);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message || "Failed to load user details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [location.search]); // Re-run the effect when the query string changes

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className={`p-4 mt-6 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-2 p-2 border rounded">
                <img
                    src={profilePicture || userInfo.profilePicture} // Fallback to user profile picture
                    alt="Profile"
                    className="w-24 h-24 rounded-full border"
                />
                <div>
                    <h2 className="text-2xl font-bold">{userInfo.firstname + " " + userInfo.lastname}</h2>
                    <p>{"@" + userInfo.username}</p>
                    <button onClick={logout} className="bg-red-500 px-2 py-0.5 text-white rounded hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </div>

            {/* Bio Section */}
            <div className="mt-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">Bio</h3>
                <p><strong>Headline:</strong> {userInfo.bio?.headline || "N/A"}</p>
                <p><strong>About:</strong> {userInfo.bio?.about || "N/A"}</p>
            </div>

            {/* Social Info Section */}
            <div className="mt-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">Social</h3>
                <p><strong>Followers:</strong> {userInfo.social?.followers || 0}</p>
                <p><strong>Following:</strong> {userInfo.social?.following || 0}</p>
                <p><strong>Verified:</strong> {userInfo.social?.verified ? "Yes" : "No"}</p>
            </div>

            {/* Users to Follow Section */}
            <div className="mt-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">Users to Follow</h3>
                {usersToFollow.length > 0 ? (
                    <ul>
                        {usersToFollow.map(({ _id, firstname, lastname, username }) => (
                            <li key={_id} className="mb-2">
                                <a href={`/profile?username=${username}`} className="text-blue-500 hover:underline">
                                    {firstname} {lastname} (@{username})
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No users to follow at the moment.</p>
                )}
            </div>
        </div>
    );
}

Profile.propTypes = {
    profilePicture: PropTypes.string.isRequired,
    theme: PropTypes.oneOf(["light", "dark"]).isRequired,
};
