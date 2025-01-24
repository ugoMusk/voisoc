const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const verifyUser = require("../../crud/verify_user.js");
const { connectDB, getUsersCollection } = require("../../db/database.js");

const SECRET = process.env.JWT_SECRET || "defaultSecretKey";


// Email verification handler
const verifyEmailHandler = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
	
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // Ensure the database is connected
        await connectDB();

	const usersCollection = getUsersCollection();
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) })
	if (user.verified){
	    return res.status(200).json({ message: "User already verified", user });
	} else {
            // Call the verifyUser function with the decoded userId
            const user = await verifyUser(decoded.id);

            return res.status(200).json({ message: "User verified successfully", user });
	}
    } catch (error) {
        console.error("Error during email verification:", error.message);
        res.status(500).json({ error: "Error during email verification", "Reason": error.message });
    }
};


module.exports = verifyEmailHandler;
