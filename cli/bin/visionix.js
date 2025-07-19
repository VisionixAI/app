#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 1 || args.includes('--help')) {
  console.log(`
VisionixAI CLI

Usage:
  visionix analyze <video-path>

Description:
  Streams video, detects presence in zones, triggers responses.
`);
  process.exit(0);
}

const command = args[0];
const input = args[1];

if (command === 'analyze') {
  // Always resolve relative to this script, not cwd
  const scriptPath = path.resolve(__dirname, '..', 'ml-core', 'start.py');

  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ start.py not found at: ${scriptPath}`);
    process.exit(1);
  }

  if (!input || !fs.existsSync(input)) {
    console.error(`❌ Input video not found: ${input}`);
    process.exit(1);
  }

  console.log('📦 Launching Python:', scriptPath);

  const subprocess = spawn('python3', ['-u', scriptPath, input], {
    stdio: 'inherit'
  });

  subprocess.on('exit', (code) => {
    console.log(`\n✅ Process exited with code ${code}`);
    process.exit(code);
  });
} else if (command === 'setup-ml') {
  require('./scripts/setup-ml'); // install venv, pip install, etc.
}
else {
  console.log(`❌ Unknown command: ${command}`);
}
