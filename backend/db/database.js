require('dotenv').config();
const { MongoClient } = require('mongodb');
const Joi = require('joi');

// Environment variables
const url = process.env.MONGO_URI_localhost || 'mongodb://localhost:27017/voisocdb';
const dbName = process.env.DB_NAME || 'voisocdb';
console.log('MongoDB URI:', url);

// MongoDB Client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;
let usersCollection = null;
let tokensCollection = null;
let postsCollection = null;
let messagesCollection = null;
let sessionsCollection = null;

// Connect to the database
const connectDB = async () => {
    if (db) {
        console.log("Database is already connected.");
        return;
    }

    try {
        await client.connect();
        console.log("MongoDB Connected.");
        db = client.db(dbName);
        usersCollection = db.collection('users');
        tokensCollection = db.collection('tokens');
        postsCollection = db.collection('posts');
        messagesCollection = db.collection('messages');
	sessionsCollection = db.collection('sessions');
        console.log("Collections initialized.");
    } catch (err) {
        console.error("Database connection error:", err.message, err.stack);
        process.exit(1);
    }
};

// Close the database connection
const closeDB = async () => {
    if (client) {
        try {
            await client.close();
            console.log("MongoDB connection closed.");
        } catch (err) {
            console.error("Error closing MongoDB connection:", err.message);
        }
    }
};

// Utility: Validate data against a Joi schema
const validateData = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((d) => d.message).join(', ')}`);
    }
    return value;
};

// Initialize default collections for a user
const initializeDefaultCollections = async (userId) => {
    const postSchema = Joi.object({
        userId: Joi.string().required(),
        content: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
        reaction: Joi.object({
            likes: Joi.number().min(0).default(0),
	    love: Joi.number().min(0).default(0),
            dislikes: Joi.number().min(0).default(0),
	    anger: Joi.number().min(0).default(0),
        }).optional(),
        impression: Joi.array().items(Joi.string()).default([]),
    });

    const messageSchema = Joi.object({
        senderId: Joi.string().required(),
        recipientId: Joi.string().required(),
        text: Joi.string().required(),
        media: Joi.object({
            url: Joi.string().uri(),
            type: Joi.string().valid('image', 'video', 'file').optional(),
            size: Joi.string().optional(),
        }).optional(),
        timestamp: Joi.date().default(Date.now),
        status: Joi.string().valid('sent', 'delivered', 'read').default('sent'),
    });

    const defaultPosts = [
        {
            userId,
            content: "Welcome to Voices of Change!",
            createdAt: new Date(),
            reaction: { likes: 0, dislikes: 0 },
            impression: [],
        },
    ];

    const defaultMessages = [
        {
            senderId: "admin", // Admin as sender
            recipientId: userId,
            text: "Welcome to Voices of Change! Feel free to explore.",
            timestamp: new Date(),
            status: "sent",
        },
    ];

    try {
        const validPosts = defaultPosts.map((post) => validateData(postSchema, post));
        const validMessages = defaultMessages.map((msg) => validateData(messageSchema, msg));

        const postsResult = await postsCollection.insertMany(validPosts);
        const messagesResult = await messagesCollection.insertMany(validMessages);

        console.log("Default collections initialized successfully.");
        return { posts: postsResult.insertedIds, messages: messagesResult.insertedIds };
    } catch (error) {
        console.error("Failed to initialize default collections:", error.message);
        throw error;
    }
};

// Getters for collections
const getUsersCollection = async () => {
    await connectDB(); // Ensure the database is connected
    if (!usersCollection) throw new Error("Database not connected. Call connectDB() first.");
    return usersCollection;
};

const getTokensCollection = async () => {
    await connectDB(); // Ensure the database is connected
    if (!tokensCollection) throw new Error("Database not connected. Call connectDB() first.");
    return tokensCollection;
};

const getPostsCollection = async () => {
    await connectDB(); // Ensure the database is connected
    if (!postsCollection) throw new Error("Database not connected. Call connectDB() first.");
    return postsCollection;
};

const getMessagesCollection = async () => {
    await connectDB(); // Ensure the database is connected
    if (!messagesCollection) throw new Error("Database not connected. Call connectDB() first.");
    return messagesCollection;
};

const getSessionsCollection = async () => {
    await connectDB(); // Ensure the database is connected
    if (!sessionsCollection) throw new Error("Database not connected. Call connectDB() first.");
    return sessionsCollection;
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});

module.exports = {
    connectDB,
    closeDB,
    getUsersCollection,
    getTokensCollection,
    getPostsCollection,
    getMessagesCollection,
    initializeDefaultCollections,
    getSessionsCollection,
};
