import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthenticationContext.js";
import getAllUsersWithTokens from "../../utils/user_list.js";

const ContactsList = () => {
    const [contacts, setContacts] = useState([]); // Contacts state
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const usersArray = await getAllUsersWithTokens();
                console.log("Fetched contacts:", usersArray);

                // Log each user for debugging
                usersArray.forEach((user, index) => {
                    console.log(`Contact [${index + 1}]:`, user);
                });

                setContacts(usersArray);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            }
        };

        fetchContacts();
    }, []);

    const onSelectContact = (contact) => {
        navigate(`/messages/${contact.username}`);
    };

    return (
        <div className="contacts-list">
            <h2 className="border-y border-gray-900 text-blue-700 text-2xl text-bold">Connections</h2>
            <ul>
                {contacts
                    .filter((contact) => contact.username !== currentUser.username) // Filter out current user
                    .map((contact) => (
                        <li key={contact.id} onClick={() => onSelectContact(contact)} className="border-t">
                            <img
                                className="h-6 w-6"
                                src={contact.bio?.profilePicture}
                                alt={`${contact.username}'s avatar`}
                            />
                            <span>{contact.firstname + " " + contact.lastname}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default ContactsList;
