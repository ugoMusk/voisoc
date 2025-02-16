const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { createClient } = require("redis");
const { connectDB, getUsersCollection } = require("../../db/database.js");
const { getUserByEmail } = require("../../crud/user_info.js");

dotenv.config();

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error from auth_profile:", err));
redisClient.connect();

const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure database connection
        await connectDB();

        // Fetch user data by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

	console.log("User from backend login: ", user);
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Generate a unique session ID
        const sessionId = `sess:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create session data
        const sessionData = {
            sessionId,
            token,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 86400000), // 24 hours later
        };

        // Store session in Redis
        await redisClient.set(sessionId, JSON.stringify(sessionData), { EX: 86400 }); // Expire after 24 hours
        console.log("Stored session in Redis:", sessionData);

        // Update the user's sessions array in MongoDB
        const usersCollection = await getUsersCollection();
        await usersCollection.updateOne(
            { _id: user._id },
            { $push: { sessions: sessionData } } // Push the session data to the sessions array
        );
        console.log("Updated user sessions in MongoDB");

        // Set the session ID as a cookie
        res.cookie("connect.sid", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 86400000, // 24 hours
        });

        // Respond to the client
        res.status(200).json({
            message: "Login successful",
            sessionId,
            user,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "An error occurred during login." });
    }
};

module.exports = loginHandler;
