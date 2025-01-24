const { connectDB, getPostsCollection } = require("../db/database.js");

/**
 * Create a new post in the database.
 * @param {Object} postData - The data for the new post.
 * @returns {Object} - The created post.
 */
const createPost = async (postData) => {
    try {
	 await connectDB();
    console.log("Database connected successfully.");
    const postsCollection = await getPostsCollection();

    // Validate required fields
    const { userId, content, media } = postData;
    if (!userId) throw new Error("User ID is required.");
    if (!content && (!media || media.length === 0)) {
      throw new Error("Post must have content or media.");
    }

    // Set default values for reactions and impressions
    const defaultReactions = { like: 0, love: 0, wow: 0 };
    const defaultImpressions = [];

    const post = {
      userId,
      content: content || "",
      media: media || [],
      reactions: defaultReactions,
      impressions: defaultImpressions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new post into the database
    const result = await postsCollection.insertOne(post);

    return { ...post, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw error;
  }
};

module.exports = { createPost };
