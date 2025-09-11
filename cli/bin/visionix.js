#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length < 1 || args.includes('--help')) {
  console.log(`\nVisionixAI CLI\n\nUsage:\n  visionix analyze <video-path>\n\nDescription:\n  Streams video, detects presence in zones, triggers responses.\n\nOptions:\n  --help        Show this help message\n`);
  process.exit(0);
}

const command = args[0];
const input = args[1];

if (command === 'analyze') {
  const scriptPath = path.resolve(__dirname, '..', 'ml-core', 'start.py');

  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ start.py not found at: ${scriptPath}`);
    console.error('➡️  Please reinstall the CLI or contact support.');
    process.exit(1);
  }

  if (!input) {
    console.error('❌ No input video path provided.');
    console.error('➡️  Usage: visionix analyze <video-path>');
    process.exit(1);
  }
  if (!fs.existsSync(input)) {
    console.error(`❌ Input video not found: ${input}`);
    console.error('➡️  Please provide a valid path to a video file.');
    process.exit(1);
  }

  console.log('📦 Launching Python:', scriptPath);
  let spinnerInterval;
  let spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
  let spinnerIndex = 0;
  function startSpinner() {
    process.stdout.write('⏳ Processing... ');
    spinnerInterval = setInterval(() => {
      process.stdout.write(`\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]} Processing... `);
    }, 120);
  }
  function stopSpinner() {
    if (spinnerInterval) clearInterval(spinnerInterval);
    process.stdout.write('\r');
  }

  startSpinner();
  const subprocess = spawn('python3', ['-u', scriptPath, input], {
    stdio: 'inherit'
  });

  subprocess.on('exit', (code) => {
    stopSpinner();
    if (code === 0) {
      console.log(`\n✅ Analysis complete! Process exited with code ${code}`);
    } else {
      console.error(`\n❌ Analysis failed. Process exited with code ${code}`);
      console.error('➡️  Please check your Python environment and logs for details.');
    }
    process.exit(code);
  });
} else if (command === 'setup-ml') {
  require('./scripts/setup-ml'); // install venv, pip install, etc.
} else {
  console.log(`❌ Unknown command: ${command}`);
  console.log('➡️  Use --help to see available commands.');
}
