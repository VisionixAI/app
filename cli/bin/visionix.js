#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { write, writeError, getLogFilePath } = require('./utils/logger');
const { getRuntimeConfigPath } = require('./utils/paths');

const args = process.argv.slice(2);

if (args.length < 1 || args.includes('--help')) {
  console.log(`
__     ___     _             _           _    ___ 
\ \   / (_)___(_) ___  _ __ (_)_  __    / \  |_ _|
 \ \ / /| / __| |/ _ \| '_ \| \ \/ /   / _ \  | | 
  \ V / | \__ \ | (_) | | | | |>  <   / ___ \ | | 
   \_/  |_|___/_|\___/|_| |_|_/_/\_\ /_/   \_\___|

  VISIONIX AI CLI

  Welcome to Visionix AI's CLI Tool! Welcome to the future without Switches!
  `);
  process.exit(0);
}

const command = args[0];
const input = args[1];

function resolvePython() {
  // Prefer venv Python if configured
  try {
    const rc = JSON.parse(fs.readFileSync(getRuntimeConfigPath(), 'utf8'));
    if (rc && rc.venvPython) {
      try { execSync(`"${rc.venvPython}" --version`, { stdio: 'ignore', timeout: 5000 }); return `"${rc.venvPython}"`; } catch (_) {}
    }
  } catch (_) {}
  const candidates = ['python3', 'python', 'py -3'];
  for (const c of candidates) {
    try { execSync(`${c} --version`, { stdio: 'ignore', timeout: 5000 }); return c; } catch (_) {}
  }
  return null;
}

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
  const py = resolvePython();
  if (!py) {
    stopSpinner();
    console.error('❌ Python not found.');
    console.error('➡️  Please install Python 3 and ensure it is in your PATH.');
    console.error(`📝 See logs: ${getLogFilePath()}`);
    process.exit(1);
  }
  const pyParts = py.split(' ');
  const pyCmd = pyParts[0];
  const pyArgs = pyParts.slice(1).concat(['-u', scriptPath, input]);
  const subprocess = spawn(pyCmd, pyArgs, {
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
