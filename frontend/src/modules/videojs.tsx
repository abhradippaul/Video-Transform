import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  type?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type = "application/x-mpegURL",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Player options
    const options: any = {
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src,
          type,
        },
      ],
    };

    // Initialize player
    playerRef.current = videojs(videoRef.current, options);

    // Autoplay
    playerRef.current.play().catch(() => {
      console.log("Autoplay failed — user interaction required");
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, type]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
