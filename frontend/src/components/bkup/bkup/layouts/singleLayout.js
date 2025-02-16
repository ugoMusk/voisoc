import React, { useEffect, useState } from "react";
import Navbar from "../Navbar.js";

export default function ResponsiveLayout({ children }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navbarWidth = Math.max(windowWidth / 8, 64); // Minimum 64px for small screens

    return (
	<div>
	    <div className="min-h-screen flex bg-black text-white">
		{/* Navbar: positioned on the left */}
		<div
		    className="bg-black flex-shrink-0 h-full"
		    style={{ width: `${navbarWidth}px` }}
		>
		    <span>{!windowWidth < 600 ? <br /> : null}</span>
		    <Navbar compact={windowWidth < 600} />
		</div>

		{/* Main Content Area */}
		<div
		    className="flex-grow p-4 bg-cover bg-center flex flex-col"
		    style={{
			backgroundImage: `url('/home/ugomusk/alx/portfolio_projs/voisoc/frontend/src/components/home2.jpg')`,
		    }}
		>
		    {/* Content */}
		    <div className="flex-grow">{children}</div>
		</div>
	    </div>
	    {/* Footer */}
	    <div className="bg-white-8 bg-opacity-10 text-gray-700 text-sm p-4 w-full">
		<p className="text-center">All Rights Reserved: ThankGod UGOBO (c)2024</p>
	    </div>
	</div>
    
  );
}
