const { Server } = require("socket.io");
const { getMessagesCollection } = require("./db/database.js"); // Import your database functions

function initializeSocket(server) {
    const io = new Server(server, {
        transports: ["websocket", "polling"],
        cors: {
            origin: ["http://localhost:3000"],
            credentials: true,
        },
    });

    // Map to store user socket connections
    const connectedUsers = new Map();

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Event: User joins with their user ID
        socket.on("join", (userId) => {
            connectedUsers.set(userId, socket.id); // Map userId to socket.id
            console.log(`User ${userId} joined with socket ID: ${socket.id}`);
        });

        // Event: Fetch chat history
        socket.on("getMessages", async ({ userId, recipientId }) => {
            try {
                const messagesCollection = await getMessagesCollection();
                
                // Query to fetch messages between the two users
                const messages = await messagesCollection
                    .find({
                        $or: [
                            { senderId: userId, recipientId },
                            { senderId: recipientId, recipientId: userId },
                        ],
                    })
                    .sort({ timestamp: 1 }) // Sort by timestamp to get messages in order
                    .toArray();

                console.log(
                    `Loaded ${messages.length} messages between ${userId} and ${recipientId}`
                );

                // Send the messages back to the client
                socket.emit("loadMessages", messages);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        });

        // Event: Sending a message
        socket.on("sendMessage", async (data) => {
            const { senderId, recipientId, text, media } = data;

            console.log("Received message from client:", data);

            try {
                const newMessage = {
                    senderId,
                    recipientId,
                    text,
                    media: media || null,
                    timestamp: new Date(),
                    status: "sent",
                };

                // Save the message to the database
                const messagesCollection = await getMessagesCollection();
                const result = await messagesCollection.insertOne(newMessage);
                console.log("Message saved to database:", result.insertedId);

                // Emit the message to the recipient if they are online
                const recipientSocketId = connectedUsers.get(recipientId);
                if (recipientSocketId) {
                    console.log(
                        `Emitting message to recipient (${recipientId}) with socket ID: ${recipientSocketId}`
                    );
                    io.to(recipientSocketId).emit("receiveMessage", newMessage);
                } else {
                    console.log(`Recipient (${recipientId}) is not online.`);
                }
            } catch (error) {
                console.error("Error handling sendMessage:", error);
            }
        });

        // Event: Disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);

            // Remove the disconnected user from the map
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    console.log(`User ${userId} removed from connected users`);
                    break;
                }
            }
        });
    });

    return io;
}

module.exports = initializeSocket;
