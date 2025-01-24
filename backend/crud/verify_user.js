const { ObjectId } = require("mongodb");
const { connectDB, getUsersCollection } = require("../db/database");

const verifyUser = async (userId) => {
    try {
        const usersCollection = getUsersCollection();
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        // Ensure user exists
        if (!user) {
            throw new Error("User not found");
        }

        // Check if the user is already verified to avoid unnecessary updates
        if (user.verified) {
            console.log("User is already verified:", userId);
            return user;  // Return the user without making any changes
        } else {
	    // Update the user's 'verified' status to true
            const updateResult = await usersCollection.updateOne(
		{ _id: new ObjectId(userId) },
		{ $set: { verified: true } }
            );
	    // Check if the update was successful
            if (updateResult.matchedCount === 0) {
		throw new Error("No matching user found to update.");
            }

            if (updateResult.modifiedCount === 0) {
		console.warn("User was not updated, but matched.");
            } else {
		console.log("User verified successfully:", userId);
            }

            // Fetch and return the updated user to confirm the change
            const updatedUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
            return updatedUser
	};
    } catch (error) {
        console.error("Error during user verification:", error.message);
        throw error;
    }
};

module.exports = verifyUser;
