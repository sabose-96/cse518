import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import useGestureStore from "./store/store";
import { PostContainer } from "./components/postcontainer";
import { MatchContainer } from "./components/matchcontainer";
import { MatchHistory, MatchHistoryComponent } from "./components/matchhistory";

interface WebSocketMessage {
  event: "smile_detected" | "left_swipe" | "right_swipe";
  frame: any;
}

const TIME_TO_WAIT = 14;

const GestureDetector: React.FC = () => {
  const socketUrl = "ws://localhost:8000/ws";
  const { isSmiling, swipeDirection, setSmiling, setSwipeDirection } =
    useGestureStore();
  const videoRef = useRef<HTMLImageElement>(null);

  const { lastJsonMessage } = useWebSocket<WebSocketMessage>(socketUrl, {
    onOpen: () => console.log("WebSocket connection established."),
    shouldReconnect: (closeEvent) => true,
  });

  const [postCounter, setPostCounter] = useState(0);
  const [matched, setMatched] = useState(false);
  const [countdown, setCountdown] = useState(TIME_TO_WAIT); // how long it takes to read a tweet
  const [matchHistory, setMatchHistory] = useState<Array<MatchHistory>>([
]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      // Decrease the countdown value every second
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    // Use setTimeout to reset the countdown after it reaches 0
    if (countdown === 0) {
      if (postCounter < 9) {
        setPostCounter(postCounter + 1);
        setMatched(false);
      }

      setTimeout(() => {
        setCountdown(TIME_TO_WAIT); // Reset the countdown to 5 seconds
      }, 1000); // Delay before resetting (2 seconds)
    }
  }, [countdown]); // Effect re-runs whenever countdown changes

  useEffect(() => {
    if (lastJsonMessage) {
      console.log("Received message:", lastJsonMessage);
      if (videoRef.current) {
        
        videoRef.current.src = "data:image/jpeg;base64," + lastJsonMessage.frame;
      }

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
    if (matched) {
      setCountdown(2000);
    }
  }, [matched]);

  useEffect(() => {
    if (isSmiling) {
      setMatched(true);
      const timer = setTimeout(() => setSmiling(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSmiling, setSmiling]);

  useEffect(() => {
    if (swipeDirection) {
      if (matched) {
        setCountdown(TIME_TO_WAIT);
        setMatched(false);
        setMatchHistory(
          matchHistory.concat({
            person: postCounter + 1,
            matched: swipeDirection == "right",
          }),
        );

        setPostCounter(postCounter + 1);
      }
      const timer = setTimeout(() => setSwipeDirection(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection, setSwipeDirection]);

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.src = "http://localhost:8000/video_feed";
  //   }
  // }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container">
        <div className="grid grid-cols-2 gaps-2">
          <div className="flex items-center">
            <div>
              <img ref={videoRef} alt="Video feed" width={640} height={480} />
            </div>
          </div>
          <div>
            {matched ? (
              <div>
                <button className="btn">
                  You matched! Swipe left or right now within
                  <div className="badge badge-secondary">{countdown}s</div>
                </button>
                <MatchContainer
                  postCounter={postCounter}
                  clickedSide="none"
                ></MatchContainer>
              </div>
            ) : (
              <div>  
                <button className="btn mb-2">
                  Time to decide
                  <div className="badge badge-secondary w-10">{countdown}s</div>
                </button>
                <PostContainer postCounter={postCounter}></PostContainer>
              </div>
            )}
            
        <MatchHistoryComponent matchHistory={matchHistory}></MatchHistoryComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureDetector;
