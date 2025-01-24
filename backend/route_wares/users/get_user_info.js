const { getUserByUsername, getUserByEmail } = require("../../crud/user_info.js");

const getUserInfoHandler = async (req, res) => {
    const { username, email } = req.query; // Get query parameters from the request

    try {
        // Validate input
        if (!username && !email) {
            return res.status(400).json({
                error: "Please provide either a username or email to fetch user information.",
            });
        }

        let user;
        if (username) {
            user = await getUserByUsername(username);
        } else if (email) {
            user = await getUserByEmail(email);
        }

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Respond with user info (exclude sensitive fields like password)
        const { password, ...userInfo } = user; // Exclude password from the response
        res.status(200).json(userInfo);
    } catch (error) {
        console.error("Error fetching user information:", error.message);
        res.status(500).json({ error: "Failed to fetch user information." });
    }
};

module.exports = getUserInfoHandler;
