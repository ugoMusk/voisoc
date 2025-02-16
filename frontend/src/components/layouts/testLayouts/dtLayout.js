import React from "react";
import Navbar from "../Navbar.js";

export default function DesktopLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main content: Takes 5/6 of the width, background image applied here */}
      <div
        className="flex-grow p-4 sm:w-5/6 bg-cover bg-center"
        style={{
          backgroundImage: `url('/home/ugomusk/alx/portfolio_projs/voisoc/frontend/src/components/home2.jpg')`,  // Ensure the path is correct
        }}
      >
        {children}
      </div>

      {/* Navbar: Takes 1/6 of the width */}
      <div className="bg-black w-1/6 h-full">
        <Navbar compact={false} />
      </div>

      {/* Footer: Positioned at the bottom */}
      <div className="bg-gray-800 bg-opacity-90 text-gray-700 text-sm p-4 w-full fixed bottom-0 left-0">
          <p className="text-center">All Rights Reserved: ThankGod UGOBO (c)2024</p>
      </div>
    </div>
  );
}
