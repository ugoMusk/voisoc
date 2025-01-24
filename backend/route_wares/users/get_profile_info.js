const { getUsersCollection } = require("../../db/database.js");

const getUserProfileHandler = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username parameter is required" });
        }

        // Fetch user information from the database
        const usersCollection = await getUsersCollection();
        const userInfo = await usersCollection.findOne(
            { username },
            { projection: { password: 0, tokens: 0 } } // Exclude sensitive fields
        );

        if (!userInfo) {
            return res.status(404).json({ error: "User not found" });
        }

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
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "An internal server error occurred" });
    }
};

module.exports = getUserProfileHandler;
