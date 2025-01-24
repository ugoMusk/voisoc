const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { createUser } = require("../../crud/create_user.js");
const { deleteUserById } = require("../../crud/delete_user_by_id.js");

const SECRET = process.env.JWT_SECRET || "defaultSecretKey";
const APP_URL = process.env.APP_URL || "http://localhost:5000";

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const registerHandler = async (req, res) => {
    const {
        email,
        username,
        password,
        firstname,
        middlename,
        lastname,
        country,
    } = req.body;

    try {
        // Validate request body
        if (!email || !username || !password || !firstname || !lastname || !country) {
            return res.status(400).json({ error: "Required fields are missing." });
        }

        // Hash the password using bcrypt
	const salt = await bcrypt.genSalt(10);  // 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in the database with hashed password
        const userId = await createUser({
            email,
            username,
            password: hashedPassword, // Store the hashed password
            firstname,
            middlename,
            lastname,
            country,
        });

        // Generate a verification token
        const verificationToken = jwt.sign({ id: userId, email }, SECRET, {
            expiresIn: "1h",
        });

        const verificationLink = `${APP_URL}/verify?token=${verificationToken}`;

        // Send verification email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email Address",
                html: `
                    <h1>Welcome to Voices of Change!</h1>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>This link will expire in 1 hour.</p>
                `,
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);

            // Rollback user creation
            await deleteUserById(userId); // Implement a `deleteUser` function in your CRUD operations
            return res.status(500).json({ error: "Failed to send verification email." });
        }

        // Respond with success
        res.status(201).json({
            message: "User registered successfully. A verification email has been sent.",
            userId,
        });
    } catch (error) {
        console.error("Registration failed:", error.message);

        // Handle conflicts (e.g., email or username already exists)
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ error: "Failed to register user." });
    }
};

module.exports = registerHandler;
