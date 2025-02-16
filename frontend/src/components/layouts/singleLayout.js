import React, { useEffect, useState } from "react";
import Navbar from "../home/Navbar.js";
import { useLocation } from "react-router-dom";
import UserProfile from "../home/Profileicon.js"

export default function ResponsiveLayout({ children }) {
    // set window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    //Determine background based on current route
    const location = useLocation();
    const isHomeRoute = location.pathname === "/";
    const bgImage = isHomeRoute ? "home-background" : "bg-black";

    // User profile thumbnail
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const profilePicture = "../../home.jpeg";


    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navbarWidth = Math.max(windowWidth / 8, 64); // Minimum 64px for small screens

    return (
        <div className={`min-h-screen ${bgImage}`}>
	    <div className="absolute top-4 right-4">
		<UserProfile isLoggedIn={isLoggedIn} profilePicture={profilePicture} />
	    </div>
            {/* Main flex container for the navbar and content */}
            <div className="flex">
                {/* Navbar: positioned on the left */}
                <div
                    className="flex-shrink-0"
                    style={{ width: `${navbarWidth}px` }}
                >
                    <Navbar compact={windowWidth < 600} />
                </div>

                {/* Main Content Area: occupies the remaining space */}
                <div className="flex-1 p-4 bg-cover bg-center">
                    {/* Content */}
                    <div>{children}</div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 bg-white bg-opacity-2 text-gray-700 text-sm p-4 w-full">
                <p className="text-center">All Rights Reserved: ThankGod UGOBO (c)2024</p>
            </div>
        </div>
    );
}
