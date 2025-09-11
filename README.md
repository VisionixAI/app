# VisionixAI

Zone-Based Computer Vision Automation

Smart actions through visual presence detection.

VisionixAI is a computer vision platform for detecting presence in room zones and triggering automated responses — no sensors, no hardware dependencies.

## Project Structure

- `cli/` — Node.js CLI tool for interacting with the system
- `ml-core/` — Python-based computer vision core


## Quick Start (Production Install)

### Prerequisites
- Node.js (for CLI)
- Python 3.7+ and pip (for ML core)

### Global Install (Recommended)
```bash
npm install -g @visionix/cli
```
This will:
- Install the CLI globally as `visionix`
- Automatically install all required Python dependencies (OpenCV, MediaPipe, etc.)
- Write detailed install logs to `~/visionix_postinstall.log`

> **Note:** Python dependency installation may take several minutes depending on your internet speed.

### Local Development/Testing
```bash
cd cli
npm install
npm pack
npm install -g ./visionix-cli-*.tgz
```

### Manual Python Dependency Install (if needed)
If the postinstall step fails, run:
```bash
pip3 install -r cli/ml-core/requirements.txt
```

## Usage


## Usage

### Analyze a video file
```bash
visionix analyze path/to/video.mp4
```

Or, if not linked globally:
```bash
node cli/bin/visionix.js analyze path/to/video.mp4
```

### What to expect
- The CLI will show a spinner/progress indicator while analyzing.
- On success, you'll see a completion message.
- On error, you'll get a clear message and troubleshooting hints.

### What happens?
- The CLI calls the Python ML core, which processes the video, divides it into zones, and prints ON/OFF triggers for each zone based on presence.


## Troubleshooting

- **Install stuck or fails?**
	- Check `~/visionix_postinstall.log` for detailed logs.
	- Ensure Python 3 and pip are installed and available in your PATH.
	- Try installing Python dependencies manually (see above).
	- On Windows, ensure Python was installed with "Add Python to PATH" enabled or run `py -3 -m pip install -r cli/ml-core/requirements.txt`.
- **Input video not found?**
	- Double-check the path you provide to `visionix analyze`.
- **Permission errors?**
	- Try running the install with elevated permissions (e.g., `sudo`).
- **Still stuck?**
	- Open an issue and attach your `visionix_postinstall.log`.


## Development
- Add new features to `ml-core/app.py` and expose them via the CLI.
- See `ml-core/README.md` for ML core details.

---

**Logs:**
- All install logs are written to `~/visionix_postinstall.log` for easy debugging.

**Testing Locally:**
- Use `npm pack` and `npm install -g ./visionix-cli-*.tgz` to test the full install process as a user would experience it.

---

Additional Notes:
- The installer logs the current working directory, log file path, and entry/exit of major steps.
- Long-running operations use timeouts to avoid hangs; re-run if interrupted.
