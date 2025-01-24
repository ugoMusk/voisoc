const createMessage = require("../../crud/create_message.js");

const createMessageHandler = async (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "User ID and content are required." });
  }

  try {
    const message = await createMessage(userId, content);
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error creating message:", error.message);
    res.status(500).json({ error: "Failed to create message." });
  }
};

module.exports = createMessageHandler;
