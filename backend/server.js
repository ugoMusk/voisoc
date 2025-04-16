const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { createClient } = require("redis");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const initializeSocket = require("./socket.js");

const getProfileHandler = require("./route_wares/auths/auth_profile.js");
const getUserProfileHandler = require("./route_wares/users/get_profile_info.js");
const updateUserHandler = require("./route_wares/users/update_user_info.js");
const registerHandler = require("./route_wares/auths/auth_register.js");
const loginHandler = require("./route_wares/auths/auth_login.js");
const verifyEmailHandler = require("./route_wares/auths/auth_verify.js");
const deleteUserHandler = require("./route_wares/users/delete_user_info.js");
const deleteAllUsersHandler = require("./route_wares/users/delete_all_user_info.js");
const { updateProfilePicture } = require("./route_wares/users/update_profile_pic.js");
const { createPostHandler } = require("./route_wares/posts/create_post.js");
const { getPostsHandler } = require("./route_wares/posts/get_posts.js");
const createMessageHandler = require("./route_wares/messages/create_message.js");
const registerLimiter = require("./middlewares/register_limiter.js");
const authenticateUser = require("./middlewares/authenticate_user.js");


const { getUserByEmail, getUserByUsername } = require("./crud/user_info.js");
const { getAllUsersAndTokens } = require("./crud/get_users.js");

const getSessionsCollection = require("./db/database.js");

const { getUsersCollection } = require("./db/database.js");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = createServer(app); // Create HTTP server
const io = initializeSocket(server);

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();


// **Middlewares**

// Configure CORS middleware
const corsOptions = {
    origin: ['https://localhost:3000', 'http://localhost:3000', ],
    credentials: true, // Allow credentials (cookies, Authorization header)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes

// Register route
app.post("/register", registerHandler);
//app.post("/register", registerLimiter, registerHandler);

app.get("/verify", verifyEmailHandler);

app.delete("/delete", deleteUserHandler);

app.delete("/deleteall", deleteAllUsersHandler);

app.post("/update", updateUserHandler);

// Post routes
app.post("/create-post", createPostHandler);
app.post("/get-posts", getPostsHandler);


// Routes
app.post("/messages", createMessageHandler);

app.post("/upload-profile-pic", updateProfilePicture);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));


// Login route
app.post("/login", loginHandler);


// Query for user account info
app.post("/account", getProfileHandler);
app.post("/profile", getUserProfileHandler);

// Get all users and associated tokens
app.get("/users-tokens", async (req, res) => {
    try {
        const usersWithTokens = await getAllUsersAndTokens();
        res.status(200).json(usersWithTokens);
    } catch (err) {
        console.error("Error in fetch users request:", err);
        res.status(500).json({ error: "Failed to retrieve users and tokens" });
    }
});

app.post("/follow", authenticateUser, async (req, res) => {
    const { targetusername, currentusername, action } = req.body;

    if (!targetusername || !currentusername || !action) {
        return res.status(400).json({ error: "Invalid request: Missing target username, current username, or action." });
    }

    try {
        // Fetch the target user by username
        const targetUser = await getUserByUsername(targetusername);
        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found." });
        }

        // Fetch the current user by username
        const currentUser = await getUserByUsername(currentusername);
        if (!currentUser) {
            return res.status(404).json({ error: "Current user not found." });
        }

        // Initialize following and followers arrays if not present
        currentUser.social = currentUser.social || { following: [] };
        targetUser.social = targetUser.social || { followers: [] };

        if (action === "follow") {
            // Add target user to current user's following list
            if (!currentUser.social.following.includes(targetUser.username)) {
                currentUser.social.following.push(targetUser.username);
            }

            // Add current user to target user's followers list
            if (!targetUser.social.followers.includes(currentUser.username)) {
                targetUser.social.followers.push(currentUser.username);
            }
        } else if (action === "following") {
            // Remove target user from current user's following list
            currentUser.social.following = currentUser.social.following.filter(
                (username) => username !== targetUser.username
            );

            // Remove current user from target user's followers list
            targetUser.social.followers = targetUser.social.followers.filter(
                (username) => username !== currentUser.username
            );
        } else {
            return res.status(400).json({ error: "Invalid action. Use 'follow' or 'unfollow'." });
        }

        console.log("Current username:", currentUser.username, "Target username:", targetUser.username);

        // Save changes to the database
        const usersCollection = await getUsersCollection(); // Ensure this function fetches the correct collection
        await usersCollection.updateOne(
            { username: currentUser.username },
            { $set: { "social.following": currentUser.social.following } }
        );
        await usersCollection.updateOne(
            { username: targetUser.username },
            { $set: { "social.followers": targetUser.social.followers } }
        );

        return res.status(200).json({ message: `${action} successful` });
    } catch (error) {
        console.error("Error in /follow endpoint:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});


// Fallback for unhandled routes
app.use((req, res) => {
    res.status(404).json({ error: "Invalid Route" });
});


// Start server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
