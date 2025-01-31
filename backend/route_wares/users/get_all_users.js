const { getAllUsersAndTokens } = require("../../crud/get_users.js");

const getAllUsers = async (req, res) => {
    try {
        // Correctly call the function
        const usersWithTokens = await getAllUsersAndTokens();
        res.status(200).json(usersWithTokens);
        console.log("All Users Available: ", usersWithTokens);
    } catch (err) {
        console.error("Error in fetch users request:", err);
        res.status(500).json({ error: "Failed to retrieve users and tokens" });
    }
}

module.exports = { getAllUsers };
