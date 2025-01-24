const fs = require("fs");
const path = require("path");
const { getUsersCollection, getUserByUsername } = require("../../db/database.js");
const multer = require("multer");

const baseURL = "http://localhost:5000";

// Setup multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../uploads/profile_pictures/");
        
        // Ensure the directory exists
        fs.mkdirSync(uploadDir, { recursive: true });

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file type. Only image files are allowed."), false);
        }
        cb(null, true);
    },
}).single("profilePicture");

const updateProfilePicture = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ error: "File upload failed" });
        }

        const { username } = req.body; // Extract username from form data
        const file = req.file; // The uploaded file

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        try {
            // Get users collection
            const usersCollection = await getUsersCollection();

            // Update user profile picture by username
            const result = await usersCollection.updateOne(
                { username },
                { $set: { "bio.profilePicture": `${baseURL}/uploads/profile_pictures/${file.filename}` } }
            );

	    console.log("Results: ", result);

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            if (result.modifiedCount === 1) {
                return res.status(200).json({ message: "Profile picture updated successfully" });
            } else {
                return res.status(400).json({ error: "Profile picture update failed" });
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({ error: "An internal server error occurred" });
        }
    });
};

module.exports = { updateProfilePicture };
