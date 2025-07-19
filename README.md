# VisionixAI

Zone-Based Computer Vision Automation

Smart actions through visual presence detection.

VisionixAI is a computer vision platform for detecting presence in room zones and triggering automated responses — no sensors, no hardware dependencies.

## Project Structure

- `cli/` — Node.js CLI tool for interacting with the system
- `ml-core/` — Python-based computer vision core

## Setup

### 1. Install CLI dependencies
```bash
cd cli
npm install
```

### 2. (Optional) Link CLI globally
```bash
npm link
```

### 3. Install Python dependencies
```bash
cd ../ml-core
pip install -r requirements.txt
```

## Usage

### Run the CLI (analyze a video file)
```bash
visionix analyze path/to/video.mp4
```
Or, if not linked globally:
```bash
node bin/visionix.js analyze path/to/video.mp4
```

### What happens?
- The CLI calls the Python ML core, which processes the video, divides it into zones, and prints ON/OFF triggers for each zone based on presence.

## Requirements
- Node.js (for CLI)
- Python 3.7+ (for ML core)
- OpenCV, MediaPipe (installed via requirements.txt)

## Development
- Add new features to `ml-core/app.py` and expose them via the CLI.
- See `ml-core/README.md` for ML core details.
