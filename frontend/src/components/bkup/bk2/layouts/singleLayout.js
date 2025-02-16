import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.js";
import { useLocation } from "react-router-dom";

export default function ResponsiveLayout({ children }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const location = useLocation();
    const isHomeRoute = location.pathname === "/";
    const bgImage = isHomeRoute ? "home-background" : "bg-black";

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navbarWidth = Math.max(windowWidth / 8, 64); // Minimum 64px for small screens

    return (
        <div className={`min-h-screen ${bgImage}`}>
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
            <div className="bg-white-8 bg-opacity-10 text-gray-700 text-sm p-4 w-full">
                <p className="text-center">All Rights Reserved: ThankGod UGOBO (c)2024</p>
            </div>
        </div>
    );
}
