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
const createMessageHandler = require("./route_wares/messages/create_message.js");
const registerLimiter = require("./middlewares/register_limiter.js");
const authenticateUser = require("./middlewares/authenticate_user.js");

const getSessionsCollection = require("./db/database.js");
const { getAllUsers } = require("./route_wares/users/get_all_users.js");
const { followHandler } = require("./route_wares/users/following.js");

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

// Create post route
app.post("/create-post", createPostHandler);

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
app.get("/users-tokens", getAllUsers);

app.post("/follow", authenticateUser, followHandler);


// Fallback for unhandled routes
app.use((req, res) => {
    res.status(404).json({ error: "Invalid Route" });
});


// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
