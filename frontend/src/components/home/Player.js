import React, { useState } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import Loader from "../utils/Loader.js"; // Import your Loader component

const YouTubeQueue = ({ videoIds, theme, currentVideo, onVideoEnd }) => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state of the video

  // Callback when the player is ready (video is loaded and ready to play)
  const handlePlayerReady = () => {
    console.log("Player is ready!");
    setIsLoading(false); // Mark as loaded once the player is ready
  };

  // Callback for when the video state changes (detect when video ends)
  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      if (onVideoEnd) onVideoEnd(); // Trigger onVideoEnd callback when the video ends
    }
  };

  // Set the background color based on the theme
  const containerBackgroundColor = theme === "dark" ? "#000000" : "#f0f0f0";

  // YouTube player options
  const playerOptions = {
    height: "315",
    width: "100%",
    playerVars: {
      autoplay: 1, // Auto-play the video when ready
    },
  };

  return (
    <div
      className="youtube-container mb-4 youtube-slide"
      style={{
        width: "100%",
        height: "315px",
        backgroundColor: containerBackgroundColor,
        border: theme === "dark" ? "1px solid #444" : "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      {/* Show Loader component while the video is loading */}
      {isLoading && <Loader />}

      {/* YouTube player */}
      <YouTube
        videoId={videoIds[currentVideo]}
        opts={playerOptions}
        onReady={handlePlayerReady} // Triggered when player is ready
        onStateChange={handlePlayerStateChange} // Triggered when player state changes
      />
    </div>
  );
};

YouTubeQueue.propTypes = {
  videoIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  currentVideo: PropTypes.number.isRequired,
  onVideoEnd: PropTypes.func, // Callback for when the video ends
};

YouTubeQueue.defaultProps = {
  videoIds: [],
  theme: "light",
  onVideoEnd: null,
};

export default YouTubeQueue;
