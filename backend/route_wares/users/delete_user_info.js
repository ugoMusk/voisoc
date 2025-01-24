const { deleteUserByUsername } = require("../../crud/delete_user");

const deleteUserHandler = async (req, res) => {
  const { username } = req.body;

  try {
    // Validate input
    if (!username) {
      return res.status(400).json({ error: "Username is required to delete a user." });
    }

    // Attempt to delete the user and associated tokens
    const result = await deleteUserByUsername(username);

    if (result.userDeleted === 0) {
      return res.status(404).json({ error: `User "${username}" not found.` });
    }

    // Respond with success
    return res.status(200).json({
      message: `User "${username}" and their associated tokens deleted successfully.`,
      userDeleted: result.userDeleted,
      tokenDeleted: result.tokenDeleted,
    });
  } catch (error) {
    console.error("Error in deleteUserHandler:", error.message);

    // Handle server errors
    return res.status(500).json({ error: "An error occurred while deleting the user." });
  }
};

module.exports = deleteUserHandler;
