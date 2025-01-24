const { connectDB, getUsersCollection, getTokensCollection, getPostsCollection, getMessagesCollection } = require("../db/database.js");
const { ObjectId } = require("mongodb");

const deleteUserById = async (userId) => {
  try {
    console.log("Attempting to delete user and associated data for userId:", userId);

    // Ensure database connection
    await connectDB();

    const usersCollection = getUsersCollection();
    const tokensCollection = getTokensCollection();
    const postsCollection = getPostsCollection();
    const messagesCollection = getMessagesCollection();

    // Validate userId format
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId format.");
    }

    const userObjectId = new ObjectId(userId);

    // Check if the user exists
    const userExists = await usersCollection.findOne({ _id: userObjectId });
    if (!userExists) {
      throw new Error(`User with ID "${userId}" does not exist.`);
    }

    // Delete the user
    const userDeleteResult = await usersCollection.deleteOne({ _id: userObjectId });
    if (userDeleteResult.deletedCount === 0) {
      throw new Error(`Failed to delete user with ID "${userId}".`);
    }
    console.log("User successfully deleted:", userId);

    // Delete associated tokens
    const tokenDeleteResult = await tokensCollection.deleteMany({ userId: userObjectId });
    console.log(`Deleted ${tokenDeleteResult.deletedCount} tokens for userId:`, userId);

    // Delete associated posts
    const postsDeleteResult = await postsCollection.deleteMany({ userId: userObjectId });
    console.log(`Deleted ${postsDeleteResult.deletedCount} posts for userId:`, userId);

    // Delete associated messages
    const messagesDeleteResult = await messagesCollection.deleteMany({ userId: userObjectId });
    console.log(`Deleted ${messagesDeleteResult.deletedCount} messages for userId:`, userId);

    return {
      userDeleted: userDeleteResult.deletedCount,
      tokensDeleted: tokenDeleteResult.deletedCount,
      postsDeleted: postsDeleteResult.deletedCount,
      messagesDeleted: messagesDeleteResult.deletedCount,
    };
  } catch (error) {
    console.error("Failed to delete user and associated data:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { deleteUserById };
