import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../home/Navbar.js";
import { useLocation } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggle.js";
import { useAuth } from "../contexts/AuthenticationContext.js"; // Import useAuth for authentication context
import ProfileMenu from "../users/ProfileMenu.js"; // Import updated ProfileMenu component
import Loader from "../utils/Loader.js";

export default function ResponsiveLayout({ children, theme, toggleTheme }) {
    const { isAuthenticated } = useAuth(); // Get isAuthenticated from context
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true); // Loading state

    const location = useLocation();
    const isHomeRoute = location.pathname === "/";
    const bgImage = isHomeRoute ? "home-background" : "bg-black";

    const randomProfilePicture = `https://1.bp.blogspot.com/-by0H_AEwXUk/VrziWZ4NoGI/AAAAAAAITPw/h_nXnG0CVWE/s1600/index.jpg`; // Random image URL
    const randomProfilePicture2 = `https://lh3.googleusercontent.com/a/ACg8ocIEhBavg338BUW_S26EeP447xr4BxlXvX2leqXoG9FEdUGvnphK=s288-c-no`

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

      useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false); // Mark as loaded
    }, 1000); // Adjust timing based on your needs

    return () => clearTimeout(timer); // Cleanup timer on unmount
      }, []);

    const navbarWidth = Math.max(windowWidth / 8, 64);
    
    // const timeString = currentTime.toLocaleTimeString();
    const dateString = currentTime.toLocaleDateString("en-US", { year: "numeric" });

    if (isLoading) {
	return (<Loader />)}

    return (
        <div
            className={`h-full min-h-screen ${bgImage} ${
                theme === "dark" ? "text-white bg-black" : "text-black bg-white"
            }`}
        >
            {/* Theme Toggle Button */}
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />

            {/* Top-right Profile Section */}
            {isAuthenticated && (
                <ProfileMenu profilePicture={randomProfilePicture2} theme={theme} />
            )}

            {/* Main flex container */}
            <div className="flex pt-14 mb-8 justify-center items-center"> {/* Center the content */}
                <div className="flex-shrink-0 pt-10" style={{ width: `${navbarWidth}px` }}>
                    <Navbar compact={windowWidth < 900} theme={theme} />
                </div>
                <div className="flex bg-cover bg-center justify-center items-center w-full"> {/* Center the children content */}
                    <div className="w-full max-w-4xl">{children}</div> {/* Limit the width of children */}
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 bg-white bg-opacity-2 text-gray-700 text-sm p-2 w-full">
                <p className="text-center">
                    All Rights Reserved: ThankGod UGOBO {dateString}
                </p>
            </div>
        </div>
    );
}

ResponsiveLayout.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.oneOf(["dark", "light"]).isRequired,
    toggleTheme: PropTypes.func.isRequired,
};
