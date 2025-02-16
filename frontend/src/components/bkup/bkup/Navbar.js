import React, { useState, useEffect } from "react";
import { HomeIcon, BellIcon, PencilIcon, UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Navbar({ compact }) {
    // State to store window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
	const handleResize = () => {
	    setWindowWidth(window.innerWidth);
	};

	window.addEventListener("resize", handleResize);

	// Cleanup the event listener on component unmount
	return () => {
	    window.removeEventListener("resize", handleResize);
	};
    }, []);

    // Adjust icon size and margin based on window width
    const iconSize = windowWidth < 600 ? "h-5 w-5" : "h-12 w-12";
    const marginBottom = windowWidth < 600 ? "mb-2" : "mb-12";
    const sept = "_-_";

    const items = [
	{ icon: <HomeIcon className={`${iconSize}`} />, label: "Home", link: "/" },
	{ icon: <BellIcon className={`${iconSize}`} />, label: "Feed", link: "/feed" },
	{ icon: <PencilIcon className={`${iconSize}`} />, label: "Create", link: "/create" },
	
	sept,
	{ icon: <UserIcon className={`${iconSize}`} />, label: "Profile", link: "/profile" },
	{ icon: <EnvelopeIcon className={`${iconSize}`} />, label: "Messages", link: "/messages" },
    ];

  return (
    <nav className={`flex flex-col items-start p-4`}>
      {items.map((item, index) => {
        // Check if the current item is a string (separator)
        if (typeof item === "string") {
          return (
            <hr
		key={index}
		className="w-1/4 mx-auto border-gray-800 mb-4 border-t-1"
            />
          );
        }

        // Render normal navigation items
        if (item && typeof item === "object") {
          return (
            <div
              key={index}
              className={`flex items-center ${index !== items.length - 1 ? "mb-4" : ""}`}
            >
              <a href={item.link} className="flex items-center space-x-2">
                <span>{!compact ? "\u00A0" + "\u00A0" + "\u00A0" : null}</span>
                <span>{!compact ? "\u00A0" : null}</span>
                <span>{item.icon}</span>
                <span>&nbsp;</span>
                {!compact ? item.label : null}
              </a>
            </div>
          );
        }

        return null; // Fallback for unexpected types
      })}
    </nav>
  );
}
