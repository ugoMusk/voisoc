const { connectDB, getUsersCollection, getTokensCollection } = require("../db/database.js");

const deleteAllUsers = async () => {
  try {
    console.log("Attempting to delete all users and their associated tokens.");

    // Ensure database connection
    await connectDB();

    const usersCollection = await getUsersCollection();
    const tokenCollection = await getTokensCollection();

    // Delete all users
    const userDeleteResult = await usersCollection.deleteMany({});
    console.log("Users deleted:", userDeleteResult.deletedCount);

    // Delete all tokens
    const tokenDeleteResult = await tokenCollection.deleteMany({});
    console.log("Tokens deleted:", tokenDeleteResult.deletedCount);

    return {
      usersDeleted: userDeleteResult.deletedCount,
      tokensDeleted: tokenDeleteResult.deletedCount,
    };
  } catch (error) {
    console.error("Failed to delete all users and tokens:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { deleteAllUsers };
