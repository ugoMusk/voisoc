import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const baseURL = process.env.REACT_APP_BASE_URL;

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenid = localStorage.getItem("tokenid");
        const userInfo = localStorage.getItem("userInfo");
	console.log("userId from tokenid; ", tokenid);

        if (tokenid && userInfo) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userInfo));
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = async (userInfo, tokenid) => {
        try {
            if (!tokenid || !userInfo) {
                throw new Error("Invalid login response. Missing token or user data.");
            }

            localStorage.setItem("tokenid", tokenid);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            setIsAuthenticated(true);
            setUser(userInfo);
        } catch (error) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    const register = async (userDetails) => {
    try {
        // Send the registration request to the backend
        const response = await axios.post(`${baseURL}/register`, userDetails);

        // Extract the response data
        const { message, userId } = response.data;

        if (!userId) {
            throw new Error("Invalid registration response. Missing user ID.");
        }

        // Inform the user about the verification step
        alert(`${message} Please check your email to verify your account.`);

        return response.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data?.error || error.message);
        throw error;
    }
};


    const logout = () => {
        localStorage.removeItem("tokenid");
        localStorage.removeItem("userInfo");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser: user,
                login,
                register,
                logout,
                setIsAuthenticated,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}
