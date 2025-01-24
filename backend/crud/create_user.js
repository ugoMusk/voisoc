const {
    connectDB,
    getUsersCollection,
    getPostsCollection,
    getMessagesCollection,
} = require("../db/database.js");

const createUser = async (userData) => {
    try {
        // Ensure database connection
        await connectDB();

        // Get collections
        const usersCollection = await getUsersCollection();
        const postsCollection = await getPostsCollection();
        const messagesCollection = await getMessagesCollection();

        const {
            email,
            username,
            password,
            firstname,
            middlename = "",
            lastname,
            country,
	    
        } = userData;

        // Validate required fields
        if (!email || !username || !password || !firstname || !lastname || !country) {
            throw new Error("Missing required fields. Please provide all mandatory fields.");
        }

        // Check for existing user
        const existingUser = await usersCollection.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new Error("Email or username already exists.");
        }

        // Set default values for bio and social
        const defaultBio = {
            profilePicture: "", // Placeholder
	    headline: "User",
            about: "I am part of the movement of positive Change",
            location: "",
            website: "",
        };

        const defaultSocial = {
            followers: [],
            following: [],
        };

        // Create user data object
        const newUser = {
            email,
            username,
            password,
            firstname,
            middlename,
            lastname,
            country,
            bio: defaultBio,
            social: defaultSocial,
            verified: false, // Initially unverified
            tokens: [], // Token references
            posts: [], // Post references
            messages: [], // Message references
            sessions: [], // Initialize an empty sessions array
        };

        // Begin database transaction
        const session = usersCollection.client.startSession();
        session.startTransaction();

        try {
            // Insert user into the database
            const userResult = await usersCollection.insertOne(newUser, { session });
            const userId = userResult.insertedId;

            // Create default posts and messages
            const defaultPosts = [
                {
                    userId,
                    content: "Welcome to the platform!",
                    media: null,
                    createdAt: new Date(),
                    reaction: { likes: 0, love: 0, anger: 0, dislikes: 0 },
                    impression: [],
                },
            ];

            const defaultMessages = [
                {
                    userId,
                    content: "Welcome message from admin",
                    media: null,
                    createdAt: new Date(),
                    reaction: { likes: 0, dislikes: 0 },
                    impression: [],
                    senderMessage: [
                        {
                            senderId: "admin",
                            message: "Welcome to the platform!",
                            media: null,
                            createdAt: new Date(),
                        },
                    ],
                    receiverMessage: [
                        {
                            receiverId: userId,
                            message: "Welcome to the platform!",
                            media: null,
                            createdAt: new Date(),
                        },
                    ],
                },
            ];

            // Insert default posts and messages
            const [postResult, messageResult] = await Promise.all([
                postsCollection.insertMany(defaultPosts, { session }),
                messagesCollection.insertMany(defaultMessages, { session }),
            ]);

            // Update user document with references
            await usersCollection.updateOne(
                { _id: userId },
                {
                    $set: {
                        posts: Object.values(postResult.insertedIds),
                        messages: Object.values(messageResult.insertedIds),
                    },
                },
                { session }
            );

            // Commit the transaction
            await session.commitTransaction();
            console.log("User created successfully with default posts and messages:", userId);
            return userId;
        } catch (transactionError) {
            await session.abortTransaction();
            console.error("Transaction failed:", transactionError.message);
            throw new Error("User creation failed. Please try again.");
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("Error in createUser function:", error.message);
        throw new Error("Failed to create user. Ensure data integrity and try again.");
    }
};

module.exports = { createUser };
