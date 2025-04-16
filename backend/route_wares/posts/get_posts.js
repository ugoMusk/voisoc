const { getUserPosts } = require("../../crud/get_posts.js");

/**
 * Handler for retrieving all posts associated with a given user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const getPostsHandler = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch user's posts from the database
    const posts = await getUserPosts(userId);

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPostsHandler };
