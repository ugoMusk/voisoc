const express = require("express");
const userRouter = express.Router();
const getUserInfoHandler = require("./users/get_user_info.js");
const deleteUserHandler = require("./users/delete_user_info.js");
const authenticateToken = require("./users/middlewares/authenticate_token.js");

// User account route
userRouter.get("/account", authenticateToken, (req, res) => {
    // Access user info from `req.user`
    res.status(200).json({
        message: "Welcome to your account!",
        user: req.user, // The payload from the JWT
    });
});

// Delete account route
userRouter.delete("/delete", deleteUserHandler);

module.exports = userRouter;
