import axios from "axios";

async function getAllUsersWithTokens() {
    try {
        const response = await axios.get("http://localhost:5000/users-tokens", {
            withCredentials: true, // Include cookies for authentication if needed
        });

        if (!Array.isArray(response.data)) {
            throw new Error("Unexpected response format: data is not an array");
        }

        // Map response data to user objects
        const users = response.data.map((contact) => ({
            id: contact.user._id,
            username: contact.user.username,
            email: contact.user.email,
            country: contact.user.country,
            firstname: contact.user.firstname,
            lastname: contact.user.lastname,
	    bio: contact.user.bio,
        }));

        console.log("Fetched users:", users);
        return users;
    } catch (err) {
        console.error("Error fetching users and tokens:", err);
        throw new Error("Failed to fetch users and tokens");
    }
}

export default getAllUsersWithTokens;
