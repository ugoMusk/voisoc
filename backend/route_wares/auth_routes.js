const express = require("express");
const dotenv = require("dotenv");
const authRouter = express.Router();
const loginHandler = require("./auths/auth_login.js");
const registerHandler = require("./auths/auth_register.js");
const verifyEmailHandler = require("./auths/auth_verify.js");

// Load environment variables
dotenv.config();

// Authentication routes
authRouter.post("/register", registerHandler);

authRouter.post("/login", loginHandler);

authRouter.get("/verify", verifyEmailHandler);


module.exports = authRouter;
