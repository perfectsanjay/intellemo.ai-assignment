import React, { useEffect, useRef, useState } from "react";
import { Image, Transformer, Group, Text } from "react-konva";

const VideoComponent = ({ x, y, onDelete }) => {
  const [video] = useState(() => document.createElement("video"));
  const [isPlaying, setIsPlaying] = useState(true);
  const imageRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.play();

    const update = () => {
      if (!video.paused && !video.ended) {
        imageRef.current?.getLayer().batchDraw();
        requestAnimationFrame(update);
      }
    };

    video.addEventListener("play", update);

    return () => {
      video.pause();
    };
  }, [video]);

  useEffect(() => {
    if (trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDelete = () => {
    onDelete?.(); // calls parent's onDelete to remove the video
  };

  return (
    <>
      <Group x={x} y={y} draggable>
        {/* Video as Konva Image */}
        <Image
          image={video}
          width={300}
          height={200}
          ref={imageRef}
          onClick={togglePlayPause}
          onTap={togglePlayPause}
        />

        {/* Play/Pause Icon */}
        <Text
          text={isPlaying ? "⏸️" : "▶️"}
          fontSize={20}
          x={10}
          y={10}
          fill="white"
          stroke="black"
          strokeWidth={0.5}
        />

      </Group>

      {/* Transformer for resizing */}
      <Transformer ref={trRef} />
    </>
  );
};

export default VideoComponent;
