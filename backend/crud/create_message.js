const { getMessagesCollection } = require("../db/database"); // Import from the database file

// Create a new message
const createMessage = async (userId, content) => {
  if (!userId || !content) {
    throw new Error('Invalid input. User ID and content are required.');
  }

  const message = {
    userId,
    content,
    createdAt: new Date(),
    reaction: {
      likes: 0,
      dislikes: 0,
    },
    impression: [],
  };

  const messagesCollection = await getMessagesCollection();
  const result = await messagesCollection.insertOne(message);

  return result.ops[0]; // Return the inserted message
};
