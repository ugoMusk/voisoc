import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthenticationContext.js";
import { getUserList } from "./utils/user_list.js";
import axios from "axios";
import defaultProfilePic from "../../assets/user.png";

const baseURL = "http://localhost:5000";

export default function Profile({ theme }) {
    const { logout, currentUser } = useAuth();
    const location = useLocation();

    const [userInfo, setUserInfo] = useState(null);
    const [usersToFollow, setUsersToFollow] = useState([]);
    const [targetUser, setTargetUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
    const [profilePicFile, setProfilePicFile] = useState(null);

    const getQueryParams = (query) => new URLSearchParams(query);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);

                const queryParams = getQueryParams(location.search);
                const username = queryParams.get("username");
                if (!username) {
                    throw new Error("Username parameter is missing in the query string.");
                }

                const userList = await getUserList();
                const matchedUser = userList.find((item) => item.user.username === username);
                setTargetUser(matchedUser);

                if (!matchedUser) {
                    throw new Error(`User with username "${matchedUser.username}" not found.`);
                }

                const response = await axios.post(
                    `${baseURL}/profile`,
                    { username: matchedUser.user.username },
                    { withCredentials: true }
                );

                if (response.status !== 200) {
                    throw new Error("Failed to fetch user data");
                }

                const user = response.data;

                const social = user.social || {};
                const followers = Array.isArray(social.followers) ? social.followers : [];

                const isUserFollowing = followers.includes(currentUser.username);
                const storedState = localStorage.getItem(`isFollowing_${matchedUser.username}`);
                setIsFollowing(storedState ? JSON.parse(storedState) : isUserFollowing);
		setUserInfo(user);
                const usersToFollowList = userList
                      .filter(({ user }) => user.username !== matchedUser.user.username)
                      .map(({ user }) => user);
                setUsersToFollow(usersToFollowList);
            } catch (err) {
                setError(err.message || "Failed to load user details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [location.search, currentUser.username]);
    
    useEffect(() => {
        if (userInfo) {
            setFormData({
                username: userInfo.username || "",
                headline: userInfo.bio?.headline || "",
                about: userInfo.bio?.about || "",
            });
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updates = {
                username: formData.username,
                bio: { headline: formData.headline, about: formData.about },
            };

            const updatedUserInfo = { ...userInfo, ...updates };
            setUserInfo(updatedUserInfo);
            localStorage.setItem("userInfo", JSON.stringify({ userInfo: updatedUserInfo }));

            const response = await axios.post(`${baseURL}/update`, { email: userInfo.email, updates }, { withCredentials: true });
            if (response.status !== 200) throw new Error("Failed to update profile");

            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleFollowToggle = async (targetUsername) => {
        try {
            const action = isFollowing ? "following" : "follow";
            const url = `${baseURL}/follow`;

            const response = await axios.post(
                url,
                { targetusername: targetUsername, currentusername: currentUser.username, action },
                { withCredentials: true }
            );
	    
            if (response.status === 200) {
                const updatedUsersToFollow = usersToFollow.map((user) =>
                    user.username === targetUsername
                        ? { ...user, isFollowing: !user.isFollowing }
                    : user
                );

                setIsFollowing(!isFollowing);
                setUsersToFollow(updatedUsersToFollow);

                localStorage.setItem(`isFollowing_${targetUser.username}`, JSON.stringify(!isFollowing));
		window.location.reload();
            } else {
                throw new Error(`${action} failed`);
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
        }
    };

    const handleProfilePicSubmit = async (e) => {
        e.preventDefault();
        if (!profilePicFile) return;

        const formData = new FormData();
        formData.append("profilePicture", profilePicFile);
        formData.append("username", userInfo.username);

        try {
            const response = await axios.post(`${baseURL}/upload-profile-pic`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (response.status === 200) {
                setIsProfilePicModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };

    const handleProfilePicClick = () => {
        setIsProfilePicModalOpen(true);
    };

    const modalClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const formInputClass = theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black";

    if (isLoading || error || !userInfo) {
        return (
            <div className="text-center">
                {isLoading && "Loading..."}
                {error && <span className="text-red-500">{error}</span>}
                {!userInfo && !isLoading && "No user found."}
            </div>
        );
    }

    return (
        <div className="p-4 mt-6 border border-gray-400">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={userInfo.bio.profilePicture || defaultProfilePic}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover cursor-pointer"
                        onClick={handleProfilePicClick}
                    />
                    <button
                        onClick={handleProfilePicClick}
                        className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
                        title="Edit Profile Picture"
                    >
                        &#9998;
                    </button>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{userInfo.username}</h1>
                    <p className="text-gray-500">{userInfo.bio?.headline}</p>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-bold">About</h2>
                <p className="mt-2">{userInfo.bio?.about || "No details provided."}</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Edit Profile
                </button>
            </div>

	    <div className="mt-4">
                <h2 className="text-xl font-bold">About</h2>
                <p className="mt-2">{"Connections: " + userInfo.social?.following || 0}</p>
		 <p className="mt-2">{"Followers: " + userInfo.social?.followers || 0}</p>
            </div>


            <div className="mt-8 border-gray">
                <h2 className="text-xl font-bold">Suggested Users to Follow</h2>
                <ul className="mt-4 space-y-4">
                    {usersToFollow.map((user) => (
                        <li key={user.username} className="flex items-center space-x-4">
                            <img
                                src={user.bio.profilePicture || defaultProfilePic}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-bold">{user.username}</p>
                                <button
                                    onClick={() => handleFollowToggle(user.username)}
                                    className={`px-4 py-2 mt-2 rounded ${isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
                                >
                                    {isFollowing ? "following" : "Follow"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalClass}`}>
                    <form
                        onSubmit={handleSubmit}
                        className={`w-full max-w-md p-6 rounded shadow-lg ${modalClass}`}
                    >
                        <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
                        <div className="mb-4">
                            <label className="block mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded border ${formInputClass}`}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Headline</label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded border ${formInputClass}`}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded border ${formInputClass}`}
                                rows="4"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isProfilePicModalOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalClass}`}>
                    <form
                        onSubmit={handleProfilePicSubmit}
                        className={`w-full max-w-md p-6 rounded shadow-lg ${modalClass}`}
                    >
                        <h2 className="text-lg font-bold mb-4">Upload Profile Picture</h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsProfilePicModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

Profile.propTypes = {
    theme: PropTypes.oneOf(["light", "dark"]),
};
