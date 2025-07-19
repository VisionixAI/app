#!/usr/bin/env node

const { spawn } = require("child_process");

const args = process.argv.slice(2);
const command = args[0];

if (command === "analyze") {
  const imagePath = args[1];

  const pythonProcess = spawn("python3", ["../ml-core/start.py", imagePath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`🔍 ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`❌ Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`✅ Process exited with code ${code}`);
  });
} else {
  console.log("Usage: visionix analyze <image-path>");
}
