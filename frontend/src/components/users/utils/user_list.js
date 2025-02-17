import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

export const getUserList = async () => {
    try {
        const response = await axios.get(`${baseURL}/users-tokens`);
        return response.data; // Assuming the response contains the list of users
    } catch (error) {
        console.error("Error fetching user list:", error);
        return []; // Return an empty array if there's an error
    }
};
