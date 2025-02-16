import React from "react";
import Navbar from "../Navbar.js";

export default function MobileLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main content: Background image applied here */}
      <div
        className="flex-grow p-4 bg-cover bg-center"
        style={{
          backgroundImage: `url('./home2.jpg')`,  // Ensure the path is correct
        }}
      >
        {children}
      </div>

      {/* Footer: Positioned at the bottom */}
      <div className="bg-gray-800 bg-opacity-90 text-gray-700 text-sm p-4 w-full fixed bottom-0 left-0">
        <p className="text-center">All Rights Reserved: ThankGod UGOBO (c)2024</p>
      </div>

      {/* Navbar: fixed at the bottom */}
      <div className="bg-black fixed bottom-0 left-0 w-full">
        <Navbar compact={true} />
      </div>
    </div>
  );
}
