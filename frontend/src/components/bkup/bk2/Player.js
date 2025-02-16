import React, { useState, useEffect, useRef } from "react";

const YouTubeQueue = () => {
  const videos = ["UHRK9sAK0W0", "0k6HzdQXLEk", "B-VojczTofk"]; // Video IDs
  const [currentVideo, setCurrentVideo] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;

        script.onload = () => {
          // Ensure YouTube API is ready
          window.onYouTubeIframeAPIReady = initializePlayer;
        };

        document.body.appendChild(script);
      } else {
        initializePlayer(); // API already loaded
      }
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videos[currentVideo],
        events: {
          onStateChange: handlePlayerStateChange,
        },
      });
    };

    const handlePlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        setCurrentVideo((prev) => (prev + 1) % videos.length); // Move to next video
      }
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy(); // Clean up player instance
      }
    };
  }, []);

  useEffect(() => {
    // Ensure the player instance exists and can load videos
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById(videos[currentVideo]);
    }
  }, [currentVideo]);

  return (
    <div
      className="youtube-container mb-4"
      style={{
        width: "100%",
        height: "315px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div id="youtube-player" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default YouTubeQueue;
