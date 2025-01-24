const { connectDB, getUsersCollection } = require("../db/database.js");

const getUserByUsername = async (username) => {
  try {
    await connectDB(); // Ensure the database is connected
    const usersCollection = await getUsersCollection();
    return await usersCollection.findOne({ username });
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    await connectDB(); // Ensure the database is connected
    const usersCollection = await getUsersCollection();
    return await usersCollection.findOne({ email });
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    throw error;
  }
};

module.exports = { getUserByUsername, getUserByEmail };
