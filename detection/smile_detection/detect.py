import cv2
import mediapipe as mp

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.7)

# Function to detect swipe gestures
def detect_swipe(hand_landmarks):
    # Get x-coordinates of wrist and index finger tip
    wrist_x = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST].x
    index_tip_x = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x
    
    # Calculate the difference
    diff = index_tip_x - wrist_x
    
    # Determine swipe direction
    if diff > 0.1:
        return "Swipe Right"
    elif diff < -0.1:
        return "Swipe Left"
    else:
        return "No Swipe"

# Load the smile cascade classifier
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_frontalface_default.xml') 
# Function to detect smiles
def detect_smile(gray_frame, frame):
    faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5) 
    smiles = []
    for (x, y, w, h) in faces: 
        cv2.rectangle(frame, (x, y), ((x + w), (y + h)), (255, 0, 0), 2) 
        roi_gray = gray_frame[y:y + h, x:x + w] 
        roi_color = frame[y:y + h, x:x + w] 
        smiles = smile_cascade.detectMultiScale(roi_gray, 1.8, 20) 
        for (sx, sy, sw, sh) in smiles: 
            cv2.rectangle(roi_color, (sx, sy), ((sx + sw), (sy + sh)), (0, 0, 255), 2) 
        # smiles = smile_cascade.detectMultiScale(gray_frame, scaleFactor=1.7)
    return len(smiles) > 0

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert the frame to RGB for MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process the frame with MediaPipe Hands
    results = hands.process(rgb_frame)
    
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Detect swipe gesture
            swipe = detect_swipe(hand_landmarks)
            cv2.putText(frame, swipe, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    # Convert frame to grayscale for smile detection
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect smile
    if detect_smile(gray_frame, frame):
        cv2.putText(frame, "Smiling", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    cv2.imshow('Hand Gesture and Smile Detection', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
