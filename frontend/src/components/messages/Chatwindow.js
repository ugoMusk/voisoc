import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthenticationContext.js";

const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
    withCredentials: true,
});

const ChatWindow = ({ recipient, theme }) => {
    const { currentUser } = useAuth();
    console.log("current userId:", currentUser.id);
    console.log("The Recipient id: ", recipient.id);
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const userId = currentUser.id;

    console.log("Chat userId", userId, "::", "Chat recipientId:", recipient.id);

    // Handle socket connection and events
    useEffect(() => {
        // Join the chat room
        socket.emit("join", userId);
        console.log(`User ${userId} joined the chat`);

	// Fetch chat history
        const fetchMessages = () => {
            socket.emit("getMessages", { userId, recipientId: recipient.id });

            socket.on("loadMessages", (fetchedMessages) => {
                console.log("Chat history loaded:", fetchedMessages);
                setMessages(fetchedMessages);
            });
        };

        fetchMessages();

        // Handle received messages
        const handleReceiveMessage = (data) => {
            console.log("Received message from server:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        socket.on("receiveMessage", handleReceiveMessage);

        // Cleanup on component unmount
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [userId]);

    

    // Handle sending a message
    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                senderId: userId,
                recipientId: recipient.id,
                text: message,
		media: null,
                timestamp: new Date(),
            };

            // Optimistically update the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { ...newMessage, status: "sent" },
            ]);

            // Emit message to the server
            socket.emit("sendMessage", newMessage);

            // Clear the input field
            setMessage("");
        }
    };

    // Navigate back to message list
    const handleBack = () => {
        navigate("/messages");
    };

    return (
        <div
            className={`chat-window p-4 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
        >
            {/* Chat Header */}
            <div className="chat-header flex items-center gap-4 mb-4">
                <button
                    className={`${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                    } hover:underline p-2 rounded-lg`}
                    onClick={handleBack}
                >
                    Back
                </button>
                <img
                    className="w-10 h-10 mr-4 rounded-full"
                    src={recipient.avatar}
                    alt={`${recipient.username}'s avatar`}
                />
                <h3 className="text-lg ml-2 font-semibold">
                    {recipient.firstname + " " + recipient.lastname}
                </h3>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages flex flex-col gap-2 mb-4 overflow-y-auto max-h-96">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            msg.senderId === userId
                                ? theme === "dark"
                                    ? "self-end bg-blue-500 text-white"
                                    : "self-end bg-blue-600 text-white"
                                : theme === "dark"
                                ? "self-start bg-gray-700 text-gray-300"
                                : "self-start bg-gray-300 text-gray-900"
                        } p-2 rounded-lg max-w-xs`}
                    >
                        <div className="mb-1 text-sm font-bold">
                            {msg.senderId === userId ? "You" : recipient.username}
                        </div>
                        <div className="text-sm">{msg.text}</div>
                        {msg.media && (
                            <div className="mt-2">
                                <img
                                    src={msg.media}
                                    alt="Media attachment"
                                    className="rounded-lg max-w-full"
                                />
                            </div>
                        )}
                        <div className="text-xs mt-1 text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="chat-input flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-grow p-2 rounded-lg border ${
                        theme === "dark"
                            ? "bg-gray-700 text-white border-gray-600"
                            : "bg-white text-gray-900 border-gray-300"
                    }`}
                />
                <button
                    onClick={handleSendMessage}
                    className={`p-2 rounded-lg ${
                        theme === "dark"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
