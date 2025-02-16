import React, { useState, useEffect, useRef, memo } from "react";

const YouTubeQueue = () => {
  const videos = ["UHRK9sAK0W0", "0k6HzdQXLEk", "B-VojczTofk"]; // Video IDs
  const [currentVideo, setCurrentVideo] = useState(0);
  const playerRef = useRef(null); // Reference to the YouTube player instance
  const [isPlayerReady, setIsPlayerReady] = useState(false); // Tracks player readiness

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.onload = () => {
          window.onYouTubeIframeAPIReady = initializePlayer; // Callback when API is ready
        };
        document.body.appendChild(script);
      } else {
        initializePlayer(); // API already loaded
      }
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videos[currentVideo],
      events: {
        onReady: () => setIsPlayerReady(true),
        onStateChange: handlePlayerStateChange,
      },
    });
  };

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      setCurrentVideo((prev) => (prev + 1) % videos.length); // Move to next video
    }
  };

  useEffect(() => {
    if (isPlayerReady && playerRef.current) {
      playerRef.current.loadVideoById(videos[currentVideo]);
    }
  }, [currentVideo, isPlayerReady]);

  return (
    <div
      className="youtube-container mb-4"
      style={{
        width: "100%", // Adjust as needed
        height: "315px", // Fixed height to prevent resizing
        overflow: "hidden", // Prevent content overflow
      }}
    >
      <div id="youtube-player" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default memo(YouTubeQueue);
