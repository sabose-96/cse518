import cv2
import mediapipe as mp
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import uvicorn
import base64
from typing import List

app = FastAPI()

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7)

# Load the smile cascade classifier
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()

def detect_swipe(hand_landmarks):
    wrist_x = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x
    index_tip_x = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x
    diff = index_tip_x - wrist_x
    if diff > 0.1:
        return "right_swipe"
    elif diff < -0.1:
        return "left_swipe"
    return None

def detect_smile(gray_frame, frame):
    faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5)
    for (x, y, w, h) in faces:
        roi_gray = gray_frame[y:y + h, x:x + w]
        smiles = smile_cascade.detectMultiScale(roi_gray, 1.8, 20)
        if len(smiles) > 0:
            return True
    return False

async def process_frame(frame, websocket: WebSocket):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            swipe = detect_swipe(hand_landmarks)
            if swipe:
                await manager.send_personal_message({"event": swipe}, websocket)
    
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    if detect_smile(gray_frame, frame):
        await manager.send_personal_message({"event": "smile_detected"}, websocket)

    ret, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    await manager.send_personal_message({"frame": frame_base64}, websocket)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    cap = cv2.VideoCapture(0)
    try:
        while True:
            success, frame = cap.read()
            if not success:
                break
            await process_frame(frame, websocket)
            await asyncio.sleep(0.1)  # Add a small delay to control frame rate
    except Exception as e:
        print(f"Error: {e}")
    finally:
        manager.disconnect(websocket)
        cap.release()

@app.get("/")
async def get():
    return HTMLResponse("""
    <html>
        <head>
            <title>Gesture and Smile Detection</title>
        </head>
        <body>
            <h1>Gesture and Smile Detection</h1>
            <img id="video-feed" width="640" height="480">
            <div id="events"></div>
            <script>
                const ws = new WebSocket("ws://localhost:8000/ws");
                const videoFeed = document.getElementById("video-feed");
                const eventsDiv = document.getElementById("events");
                
                ws.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    if (data.frame) {
                        videoFeed.src = "data:image/jpeg;base64," + data.frame;
                    } else if (data.event) {
                        eventsDiv.innerHTML = `<p>Event detected: ${data.event}</p>` + eventsDiv.innerHTML;
                    }
                };
            </script>
        </body>
    </html>
    """)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
