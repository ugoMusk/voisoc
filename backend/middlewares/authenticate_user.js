const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error from auth middleware:", err));
redisClient.connect();

const authenticateUser = async (req, res, next) => {
    try {
        const sessionId = req.cookies["connect.sid"]; // Retrieve session ID from cookies
        if (!sessionId) {
            return res.status(401).json({ error: "Unauthorized: No session ID found." });
        }

        // Retrieve session data from Redis
        const sessionData = await redisClient.get(sessionId);
        if (!sessionData) {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired session." });
        }

        const { token} = JSON.parse(sessionData);

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Token verification failed." });
        }

        // Attach user information to the request for downstream handlers
        req.token = {
            token:  decoded,
        };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(500).json({ error: "Internal server error during authentication." });
    }
};

module.exports = authenticateUser;
