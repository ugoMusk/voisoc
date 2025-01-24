const { connectDB, getUsersCollection } = require("../db/database.js");

/**
 * Flattens an object for MongoDB updates, converting nested fields to dot notation.
 * @param {Object} obj - The object to flatten.
 * @param {string} [prefix=""] - The prefix for nested fields (used internally).
 * @returns {Object} - The flattened object.
 */
const flattenObject = (obj, prefix = "") => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {});
};

/**
 * Updates a user's information in the database.
 * @param {string} email - The email of the user to update.
 * @param {Object} updates - The updates to apply.
 * @returns {Object} - The updated user object.
 * @throws {Error} - Throws an error if the update fails.
 */
const updateUser = async (email, updates) => {
  try {
    // Ensure database connection
    await connectDB();
    const usersCollection = await getUsersCollection();

    if (!email) {
      throw new Error("Email is required to identify the user.");
    }

    // Flatten updates for MongoDB
    const flattenedUpdates = flattenObject(updates);

    // Perform the update operation
    console.log(`Updating user with email: ${email}`, flattenedUpdates);
    const result = await usersCollection.updateOne(
      { email }, // Match user by email
      { $set: flattenedUpdates } // Apply the updates
    );

    if (result.matchedCount === 0) {
      throw new Error("No user found with the specified email.");
    }

    // Fetch and return the updated user
    const updatedUser = await usersCollection.findOne({ email });
    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { updateUser };
