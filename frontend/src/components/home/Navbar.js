import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  HomeIcon,
  BellIcon,
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import PostForm from "../users/Postform.js";

export default function Navbar({ compact, theme }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navbarHeight, setNavbarHeight] = useState(window.innerHeight);
  const [isPostFormVisible, setIsPostFormVisible] = useState(false);

  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const isCreateButtonActive = ["/profile", "/feed"].includes(location.pathname);

  const navBackground = isHomeRoute
    ? theme === "dark"
      ? "bg-black"
      : "bg-gray-100"
    : theme === "dark"
    ? "bg-black"
    : "bg-gray-100";

  const textColor = theme === "dark" ? "text-white" : "text-black";
  const iconBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-400";
  const iconColor = theme === "dark" ? "text-white" : "text-black";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setNavbarHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const iconSize =
    windowWidth < 600
      ? "h-5 w-5"
      : windowWidth < 980
      ? "h-8 w-8"
      : "h-12 w-12";

  const togglePostForm = () => {
    setIsPostFormVisible(!isPostFormVisible);
  };

  const savePostToLocalStorage = (post) => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
  };

  // Get the username from localStorage to dynamically create the profile link;
    const username = localStorage.getItem("username") || "guest"; // Set default to "guest" if username is missing

  const items = [
    {
      icon: (
        <HomeIcon
          className={`${iconSize} ${iconColor} border-1 ${iconBorderColor} rounded-full`}
        />
      ),
      label: "Home",
      link: "/",
    },
    {
      icon: (
        <BellIcon
          className={`${iconSize} ${iconColor} border-1 ${iconBorderColor} rounded-full`}
        />
      ),
      label: "Feed",
      link: "/feed",
    },
    isCreateButtonActive && {
      icon: (
        <button
          onClick={togglePostForm}
          className={`flex items-center justify-center ${iconSize} border-1 ${iconBorderColor} rounded-full bg-blue-500 text-white hover:bg-blue-600`}
        >
          <PlusIcon className={`${iconSize}`} />
        </button>
      ),
      label: "Create",
      link: "#",
    },
    "---",
    {
      icon: (
        <UserIcon
          className={`${iconSize} ${iconColor} border-1 ${iconBorderColor} rounded-full`}
        />
      ),
      label: "Profile",
      link: `/profile?username=${username}`, // Dynamic profile link
    },
    {
      icon: (
        <EnvelopeIcon
          className={`${iconSize} ${iconColor} border-1 ${iconBorderColor} rounded-full`}
        />
      ),
      label: "Messages",
      link: "/messages",
    },
  ];

  return (
    <div className="flex">
      <nav
        className={`${navBackground} flex flex-col text-xs items-start pl-4 pt-24 opacity-80 fixed top-0 left-0`}
        style={{
          height: `${navbarHeight}px`,
          width: windowWidth < 600 ? "15%" : "12%",
        }}
      >
        {items
          .filter((item) => item) // Remove falsy items (like null or undefined)
          .map((item, index) => {
            if (item === "---") {
              return (
                <hr
                  key={index}
                  className={`w-1/6 mx-auto ${textColor} mb-4 ml-4 border-t`}
                />
              );
            }

            if (item && typeof item === "object") {
              return (
                <div
                  key={index}
                  className={`flex items-center ${
                    index !== items.length - 1 ? "mb-4" : ""
                  }`}
                >
                  <a
                    href={item.link}
                    className={`flex items-center space-x-1 ${textColor} hover:${
                      theme === "dark" ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    <span>{!compact ? "\u00A0" : null}</span>
                    <span>{item.icon}</span>
                    <span>&nbsp;</span>
                    <span className={`${textColor}`}>
                      {!compact ? item.label : null}
                    </span>
                  </a>
                </div>
              );
            }

            return null;
          })}
      </nav>

      {isPostFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-4 rounded-lg shadow-lg max-w-lg w-full ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <PostForm
              theme={theme} // Pass theme to PostForm
              onPostSubmit={(post) => {
                savePostToLocalStorage(post);
                setIsPostFormVisible(false);
              }}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={togglePostForm}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Navbar.propTypes = {
  compact: PropTypes.bool,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
};
