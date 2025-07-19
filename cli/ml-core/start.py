import sys
from app import run_stream

def main():
    if len(sys.argv) < 2:
        print("❌ No video path provided.")
        sys.exit(1)

    video_path = sys.argv[1]
    run_stream(video_path)

if __name__ == "__main__":
    main()
