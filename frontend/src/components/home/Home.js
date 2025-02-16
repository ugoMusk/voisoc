import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ResponsiveParagraph from "./Paragraph.js";
import ResponsiveHeading from "./Paragraphheading.js";
import Spacer from "./Spacer.js";
import { useAuth } from "../contexts/AuthenticationContext.js"; // Import useAuth to access authentication state
import Loader from "../utils/Loader.js"; // Import the Loader component
import YouTubeQueue from "./Player.js"; // Import the YouTubeQueue component

export default function Home({ quotesInterval = 5000, videoInterval = 7000 }) {
  const { isAuthenticated } = useAuth(); // Get the authentication state from the context

    const aboutVoisoc = "Voices of Change is a content-sharing and appreciation platform for leaders, activists, and advocates.\nIt is often said that the present shapes the future just as the past shaped the present—until we choose otherwise. This belief underscores the purpose of Voices of Change, a platform designed to amplify discussions on leadership, good governance, people power, and human rights activism. \n             Our goal is to provide an intuitive and inclusive space where thoughtful leaders, dedicated activists, and engaged citizens can share ideas, foster meaningful conversations, and drive societal impact. We believe humanity is deeply ingrained in every culture, and the preservation and revitalization of these cultural heritages require thoughtful leadership and a revolutionary mindset. \nWe aim to empower true leaders and positive changemakers in their efforts to preserve the diversity of humanity and inspire a brighter future.";

  const voisocHeading = "About the Project";

  const quotes = [
    "The best way to predict the future is to create it. – Abraham Lincoln",
    "Leadership is not about being in charge, it's about taking care of those in your charge. – Simon Sinek",
    "Injustice anywhere is a threat to justice everywhere. – Martin Luther King Jr.",
    "The only thing we have to fear is fear itself. – Franklin D. Roosevelt",
    "Power is not given to you. You have to take it. – Beyoncé",
  ];

  const videos = [
    "UHRK9sAK0W0",
    "0k6HzdQXLEk",
    "B-VojczTofk",
  ];

  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false); // Mark as loaded
    }, 2000); // Adjust timing based on your needs

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Change the quote every interval specified by props
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, quotesInterval);

    return () => clearInterval(quoteInterval);
  }, [quotesInterval]);

  // Handle video change when current one ends
  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length); // Change to next video
  };

  // Show loader if loading
  if (isLoading) {
    return <Loader />;
  }

  // Render Home component after loading
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center">
      <div className="text-center pt-8 pb-6 px-2 text-white bg-opacity-50 bg-black rounded-lg w-full max-w-4xl flex flex-col items-center justify-center">
        <h3 className="text-2xl font-bold mb-4">Welcome to Voices of Change</h3>

        {/* Quote Slider */}
        <div className="quote-slider mb-11">
          <p className="italic text-l">{quotes[currentQuote]}</p>
        </div>

        {/* YouTube Video Queue */}
        <YouTubeQueue
          videoIds={videos}
          theme="dark" // You can dynamically set the theme as needed
          currentVideo={currentVideo}
          onVideoEnd={handleVideoEnd} // Pass the callback to handle video end
        />

        {/* Wrapper div */}
        <div className="flex flex-col items-center justify-center">
          <Spacer />
          <ResponsiveHeading text={voisocHeading} />
          {aboutVoisoc.split("\n").map((line, index) => (
            <ResponsiveParagraph key={index} text={line} />
          ))}
          <Spacer />
          {/* Conditionally render the Join Us button */}
          {!isAuthenticated && (
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 mr-4 rounded-lg"
                onClick={() => (window.location.href = "/register")}
              >
                Join Us!
              </button>
            </div>
          )}
        </div>

        {/* Buttons for Registration (if not authenticated) */}
        <div className="button-group mt-6 join-us-button"></div>
      </div>
    </div>
  );
}

// Define PropTypes
Home.propTypes = {
  quotesInterval: PropTypes.number, // Interval for quote change (default 5000ms)
  videoInterval: PropTypes.number,  // Interval for video change (default 7000ms)
};
