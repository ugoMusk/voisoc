const { connectDB, getUsersCollection, getPostsCollection, getMessagesCollection, getTokensCollection } = require("../db/database.js");

const deleteUserByUsername = async (username) => {
  try {
    console.log("Attempting to delete user and associated data:", username);

    // Ensure database connection
    await connectDB();

    const usersCollection = getUsersCollection();
    const postsCollection = getPostsCollection();
    const messagesCollection = getMessagesCollection();
    const tokenCollection = getTokensCollection();

    // Check if the user exists
    const userExists = await usersCollection.findOne({ username });
    if (!userExists) {
      throw new Error(`User with username "${username}" does not exist.`);
    }

    // Extract the user's ID for cross-referencing
    const userId = userExists._id;

    // Delete the user document
    const userDeleteResult = await usersCollection.deleteOne({ username });
    console.log("User delete result:", userDeleteResult);

    if (userDeleteResult.deletedCount === 0) {
      throw new Error(`Failed to delete user with username "${username}".`);
    }

    // Delete associated tokens
    const tokenDeleteResult = await tokenCollection.deleteMany({ userId });
    console.log("Token delete result:", tokenDeleteResult);

    // Delete associated posts
    const postDeleteResult = await postsCollection.deleteMany({ userId });
    console.log("Post delete result:", postDeleteResult);

    // Delete associated messages
    const messageDeleteResult = await messagesCollection.deleteMany({ userId });
    console.log("Message delete result:", messageDeleteResult);

    // If there are other collections (e.g., comments, notifications, etc.), add similar deletion logic here.

    return {
      userDeleted: userDeleteResult.deletedCount,
      tokensDeleted: tokenDeleteResult.deletedCount,
      postsDeleted: postDeleteResult.deletedCount,
      messagesDeleted: messageDeleteResult.deletedCount,
      // Include other collection results if applicable
    };
  } catch (error) {
    console.error("Failed to delete user and associated data:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { deleteUserByUsername };
