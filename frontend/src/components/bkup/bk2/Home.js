import React, { useState, useEffect } from "react";
import YouTubeQueue from "./Player.js";
import ResponsiveParagraph from "./Paragraph.js";
import ResponsiveHeading from "./Paragraphheading.js";
import Spacer from "./Spacer.js";


export default function Home() {

    const aboutVoisoc = "Voices of Change is a content-sharing and appreciation platform for leaders, activists, and advocates.\nIt is often said that the present shapes the future just as the past shaped the present—until we choose otherwise. This belief underscores the purpose of Voices of Change, a platform designed to amplify discussions on leadership, good governance, people power, and human rights activism. \nOur goal is to provide an intuitive and inclusive space where thoughtful leaders, dedicated activists, and engaged citizens can share ideas, foster meaningful conversations, and drive societal impact. We believe humanity is deeply ingrained in every culture, and the preservation and revitalization of these cultural heritages require thoughtful leadership and a revolutionary mindset. \nWe aim to empower true leaders and positive changemakers in their efforts to preserve the diversity of humanity and inspire a brighter future.";
    
    const voisocHeading = "About the Project";
    
    const quotes = [
	"The best way to predict the future is to create it. – Abraham Lincoln",
	"Leadership is not about being in charge, it's about taking care of those in your charge. – Simon Sinek",
	"Injustice anywhere is a threat to justice everywhere. – Martin Luther King Jr.",
	"The only thing we have to fear is fear itself. – Franklin D. Roosevelt",
	"Power is not given to you. You have to take it. – Beyoncé",
    ];
    const [currentQuote, setCurrentQuote] = useState(0);

    // Change the quote every 5 seconds
    useEffect(() => {
	const interval = setInterval(() => {
	    setCurrentQuote((prev) => (prev + 1) % quotes.length);
	}, 5000);
	return () => clearInterval(interval);
    }, []);

    return (
	<div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
	    <div className="text-center text-white p-4 bg-opacity-50 bg-black rounded-lg w-full max-w-4xl">
		<h3 className="text-2xl font-bold mb-4">Welcome to Voices of Change</h3>

		{/* Quote Slider */}
		<div className="quote-slider mb-6">
		    <p className="italic text-l">{quotes[currentQuote]}</p>
		</div>

		{/* wrapper div */}
		<div  className="flex-col">
		    {/* YouTube Video Queue */}
		    <div className="youtube-player-container mb-12">
			<YouTubeQueue />
		    </div>
		    <Spacer />
		    <Spacer />
		    <div>
			<ResponsiveHeading text={voisocHeading}/>
			{aboutVoisoc.split("\n").map((line, index) => (
			    <ResponsiveParagraph key={index} text={line} />
			))}
		    </div>
		    <Spacer />
		    <div>
			<button
			    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 mr-4 rounded-lg"
			    onClick={() => (window.location.href = "/login")}
			>
			Join Us!			</button>
		    </div>
		</div>

		{/* Buttons for Login and Registration */}
		<div className="button-group mt-6 join-us-button">
		    
		</div>
	    </div>
	</div>
    );
}
