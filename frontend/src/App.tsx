import React, { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import useGestureStore from "./store/store";

interface WebSocketMessage {
  event: "smile_detected" | "left_swipe" | "right_swipe";
}

const GestureDetector: React.FC = () => {
  const socketUrl = "ws://localhost:8000/ws";
  const { isSmiling, swipeDirection, setSmiling, setSwipeDirection } =
    useGestureStore();
  const videoRef = useRef<HTMLImageElement>(null);

  const { lastJsonMessage } = useWebSocket<WebSocketMessage>(socketUrl, {
    onOpen: () => console.log("WebSocket connection established."),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      console.log("Received message:", lastJsonMessage);
      switch (lastJsonMessage.event) {
        case "smile_detected":
          setSmiling(true);
          break;
        case "left_swipe":
          setSwipeDirection("left");
          break;
        case "right_swipe":
          setSwipeDirection("right");
          break;
      }
    }
  }, [lastJsonMessage, setSmiling, setSwipeDirection]);

  useEffect(() => {
    if (isSmiling) {
      const timer = setTimeout(() => setSmiling(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSmiling, setSmiling]);

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => setSwipeDirection(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection, setSwipeDirection]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = "http://localhost:8000/video_feed";
    }
  }, []);

  return (
    <div>
      <h1>Gesture and Smile Detection</h1>
      <p>Smiling: {isSmiling ? "Yes" : "No"}</p>
      <p>Swipe Direction: {swipeDirection || "None"}</p>
      <img ref={videoRef} alt="Video feed" width={640} height={480} />
    </div>
  );
};

export default GestureDetector;
