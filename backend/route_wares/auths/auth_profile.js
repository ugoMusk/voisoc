const { createClient } = require("redis");
const jwt = require("jsonwebtoken");
const { getSessionsCollection, getUsersCollection } = require("../../db/database.js");

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error from auth_profile:", err));
redisClient.connect();

const getProfileHandler = async (req, res) => {
    try {
        const { username, sessionId } = req.body;

        // Ensure username and sessionId are provided
        if (!username || !sessionId) {
            return res.status(400).json({ error: "Username and sessionId parameters are required" });
        }

        // Fetch session information from Redis using the sessionId
        const redisSessionData = await redisClient.get(sessionId);
        if (!redisSessionData) {
            return res.status(401).json({ error: "Session not found or expired in Redis" });
        }

        // Parse session data from Redis
        let parsedSession;
        try {
            parsedSession = JSON.parse(redisSessionData);
        } catch (err) {
            return res.status(401).json({ error: "Invalid session data in Redis" });
        }

        // Compare sessionId in request with the one stored in Redis
        if (parsedSession.sessionId !== sessionId) {
            return res.status(401).json({ error: "Session ID mismatch. Unauthorized access" });
        }

        // Verify JWT token
        try {
            const decoded = jwt.verify(parsedSession.token, process.env.JWT_SECRET);

            // Fetch user information
            const usersCollection = await getUsersCollection();
            const userInfo = await usersCollection.findOne(
                { username },
                { projection: { password: 0, tokens: 0 } } // Exclude sensitive fields
            );

            if (!userInfo) {
                return res.status(404).json({ error: "User not found" });
            }
	    console.log("User information id: ", userInfo.id);

            // Format the response
            const response = {
		id: userInfo._id,
                email: userInfo.email,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                username: userInfo.username,
                bio: {
                    profilePicture: userInfo.bio?.profilePicture || "Avatar",
                    headline: userInfo.bio?.headline || "User",
                    about: userInfo.bio?.about || "I am part of the movement of positive Change",
                    location: userInfo.bio?.location || "",
                    website: userInfo.bio?.website || "",
                },
                social: {
                    followers: userInfo.social?.followers?.length || 0,
                    following: userInfo.social?.following?.length || 0,
                    verified: userInfo.verified || false,
                },
            };

            res.status(200).json(response);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "An internal server error occurred" });
    }
};

module.exports = getProfileHandler;
