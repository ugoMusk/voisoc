const multer = require("multer"); // Added multer for multipart handling
const { createPost } = require("../../crud/create_post.js");

// Configure multer for handling multipart form data
const upload = multer({ dest: "uploads/" });

/**
 * Handler for creating a new post.
 * This is wrapped in a middleware to handle file uploads using multer.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const createPostHandler = [
  upload.array("media[]"), // Middleware to handle file uploads
  async (req, res) => {
    try {
      const { userId, content } = req.body;
      const media = req.files || []; // Uploaded files will be in req.files

      console.log("Request Body:", req.body);
      console.log("Uploaded Media:", media);

      // Validate request body
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      if (!content && media.length === 0) {
        return res.status(400).json({ error: "Post must have content or media." });
      }

      // Prepare post data
      const postData = {
        userId,
        content,
        media: media.map((file) => ({
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
        })),
      };

      // Create the post
      const newPost = await createPost(postData);

      res.status(201).json({
        message: "Post created successfully.",
        post: newPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: error.message });
    }
  },
];

module.exports = { createPostHandler };
