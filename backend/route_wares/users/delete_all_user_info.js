const { deleteAllUsers } = require("../../crud/delete_all_users.js");

const deleteAllUsersHandler = async (req, res) => {
  try {
    // Call the deleteAllUsers function
    const result = await deleteAllUsers();

    // Respond with success
    return res.status(200).json({
      message: "All users and their associated tokens have been deleted successfully.",
      usersDeleted: result.usersDeleted,
      tokensDeleted: result.tokensDeleted,
    });
  } catch (error) {
    console.error("Error in deleteAllUsersHandler:", error.message);

    // Handle server errors
    return res.status(500).json({
      error: "An error occurred while deleting all users.",
    });
  }
};

module.exports = deleteAllUsersHandler;
