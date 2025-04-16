const { connectDB, getPostsCollection } = require("../db/database.js");

/**
 * Fetch all posts associated with a given user.
 *
 * @param {string} userId - The ID of the user whose posts are to be retrieved.
 * @returns {Promise<Array>} - List of posts.
 */
const getUserPosts = async (userId) => {
    try {
        await connectDB();
        console.log("Database connected successfully.");
        const postsCollection = await getPostsCollection();

        if (!userId) throw new Error("User ID is required.");

        // Fetch posts from the database, sorted by newest first
        const posts = await postsCollection
              .find({ userId })
              .sort({ createdAt: -1 })
              .toArray();

        return posts;
    } catch (error) {
        console.error("Error fetching user posts:", error.message);
        throw error;
    }
};

module.exports = { getUserPosts };
