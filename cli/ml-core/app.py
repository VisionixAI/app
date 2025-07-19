import cv2
import mediapipe as mp
import time

# Parameters
GRID_ROWS = 3
GRID_COLS = 3
UNSEEN_TIMEOUT = 5  # seconds

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Track zone activity
zone_last_seen = {}

def get_zone(x, y, width, height):
    zone_w = width // GRID_COLS
    zone_h = height // GRID_ROWS
    col = x // zone_w
    row = y // zone_h
    return f"{int(row)}-{int(col)}"

def draw_grid(frame):
    h, w, _ = frame.shape
    for i in range(1, GRID_ROWS):
        cv2.line(frame, (0, i * h // GRID_ROWS), (w, i * h // GRID_ROWS), (100, 100, 100), 1)
    for j in range(1, GRID_COLS):
        cv2.line(frame, (j * w // GRID_COLS, 0), (j * w // GRID_COLS, h), (100, 100, 100), 1)

def run_stream(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("❌ Cannot open video.")
        return

    print("🚀 Streaming started...")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w, _ = frame.shape
        draw_grid(frame)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb)

        active_zones = set()

        if results.pose_landmarks:
            for lm in results.pose_landmarks.landmark:
                x = int(lm.x * w)
                y = int(lm.y * h)
                zone = get_zone(x, y, w, h)
                active_zones.add(zone)
                zone_last_seen[zone] = time.time()
                cv2.circle(frame, (x, y), 3, (0, 255, 0), -1)

        now = time.time()
        for i in range(GRID_ROWS):
            for j in range(GRID_COLS):
                zone_id = f"{i}-{j}"
                last_seen = zone_last_seen.get(zone_id, 0)
                elapsed = now - last_seen
                if elapsed > UNSEEN_TIMEOUT:
                    print(f"⚠️ Zone {zone_id} inactive for {int(elapsed)}s → Trigger: OFF")
                else:
                    print(f"✅ Zone {zone_id} active → Trigger: ON")

        # Comment below to run headless
        cv2.imshow("VisionixAI", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("✅ Stream ended.")
