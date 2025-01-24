const { updateUser } = require("../../crud/update_user.js");

/**
 * Handler to update user information.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */

const updateUserHandler = async (req, res) => {
    try {
	const { email, updates } = req.body;

	// Validate request body
	if (!email || typeof email !== "string") {
	    return res.status(400).json({ error: "Valid email is required." });
	}

	if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
	    return res.status(400).json({ error: "Updates must be a valid object." });
	}

	// Define allowed fields for updates
	const allowedFields = [
	    "firstname",
	    "middlename",
	    "lastname",
	    "country",
	    "username",
	    "bio",
	    "social",
	    "messages",
	    "posts",,
	];

	// Check for invalid fields
	const invalidFields = Object.keys(updates).filter(
	    (field) => !allowedFields.includes(field)
	);

	if (invalidFields.length > 0) {
	    return res.status(400).json({
		error: `Invalid fields in updates: ${invalidFields.join(", ")}.`,
	    });
	}

	// Perform update operation
	const result = await updateUser(email, updates);

	// Check if the user was found and updated
	if (result.matchedCount === 0) {
	    return res.status(404).json({ error: "User not found." });
	}

	if (result.modifiedCount === 0) {
	    return res
		.status(200)
		.json({ message: "No changes made; data is already up to date." });
	}

	// Respond with success
	res.status(200).json({
	    message: "User updated successfully.",
	    matchedCount: result.matchedCount,
	    modifiedCount: result.modifiedCount,
	});
    } catch (error) {
	console.error("Error in updateUserHandler:", error);
	res.status(500).json({ error: "Failed to update user." });
    }
};

module.exports = updateUserHandler;
