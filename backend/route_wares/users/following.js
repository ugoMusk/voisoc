const { getUserByEmail, getUserByUsername } = require("../../crud/user_info.js");
const { getUsersCollection } = require("../../db/database.js");

const followHandler = async (req, res) => {
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
}

module.exports = { followHandler };
