import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";

import Layout from "./components/layouts/SingleLayout.js"; // Layout component
import Home from "./components/home/Home.js"; // Example page
import Profile from "./components/users/Profile.js"; // Profile page
import Login from "./components/auths/Login.js"; // Login page
import Feed from "./components/posts/Feed.js";
import Register from "./components/auths/Register.js"; // Register page
import { AuthProvider } from "./components/contexts/AuthenticationContext.js"; // Authentication context
import ProtectedRoute from "./components/auths/ProtectedRoute.js"; // ProtectedRoute component
import ContactsList from "./components/messages/Contacts.js";
import ChatWindow from "./components/messages/Chatwindow.js";
import getAllUsersWithTokens from "./utils/user_list.js";

function App() {
    const savedTheme = localStorage.getItem("theme") || "dark"; // Default theme
    const [theme, setTheme] = useState(savedTheme);
    const [contacts, setContacts] = useState([]); // Contacts state
    const [loading, setLoading] = useState(true); // Loading state

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // Save theme to localStorage
    };

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true); // Ensure loading is true initially
            try {
                const usersArray = await getAllUsersWithTokens();
                console.log("Fetched contacts outside:", usersArray);

                // Log each user for debugging
                usersArray.forEach((user, index) => {
                    console.log(`New user [${index + 1}]:`, user);
                });

                setContacts(usersArray);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);
    
    // if (loading) return <div>Loading contacts...</div>;

    return (
        <AuthProvider>
            <Router>
                <Layout theme={theme} toggleTheme={toggleTheme}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/messages"
                            element={
                                <ProtectedRoute>
                                    <ContactsList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/messages/:username"
                            element={
                                <ProtectedRoute>
                                    <ChatWithParams contacts={contacts} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile theme={theme} />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/feed" element={<Feed theme={theme} />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<div>404 - Page Not Found</div>} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

function ChatWithParams({ contacts }) {
    const { username } = useParams();
    const navigate = useNavigate();

    // Find the recipient using the username from the URL
    const recipient = contacts.find((contact) => contact.username === username);

    // Retrieve user info from localStorage
    //const userInfo = localStorage.getItem("userInfo")
      //  ? JSON.parse(localStorage.getItem("userInfo"))
        //: null;

    //const userId = userInfo?.user?.id;

    if (!recipient) {
        console.error(`No contact found with username: ${username}`);
        return <div>User not found</div>;
    }

    return (
        <ChatWindow
            recipient={recipient}
            onBack={() => navigate("/messages")}
        />
    );
}

export default App;
