const { connectDB, getUsersCollection, getTokensCollection } = require("../db/database.js");

const getAllUsersAndTokens = async () => {
    try {
        // Ensure the database is connected
        await connectDB();

        // Get the collections
        const usersCollection = await getUsersCollection();
        const tokensCollection = await getTokensCollection();

        // Fetch all users
        const users = await usersCollection.find({}).toArray();

        // Fetch all tokens
        const tokens = await tokensCollection.find({}).toArray();

        // Map tokens to their respective users
        const usersWithTokens = users.map(user => {
            const userTokens = tokens.filter(token => token.userId === user._id.toString());
            return {
                user,
                tokens: userTokens.map(token => token.token) // Extract token values
            };
        });

        return usersWithTokens;
    } catch (err) {
        console.error("Error fetching users and tokens:", err);
        throw new Error("Failed to fetch users and tokens");
    }
};

module.exports = { getAllUsersAndTokens };
