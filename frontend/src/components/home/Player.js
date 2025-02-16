import React, { useState } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";

const YouTubeQueue = ({ videoIds, theme, currentVideo, onVideoEnd }) => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state of the video

  const handlePlayerReady = () => {
    console.log("Player is ready!");
    setIsLoading(false); // Video is ready to play
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      if (onVideoEnd) onVideoEnd(); // Call the callback when video ends
    }
  };

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
      {isLoading && <div className="loader">Loading...</div>}
      <YouTube
        videoId={videoIds[currentVideo]}
        opts={playerOptions}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerStateChange}
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
