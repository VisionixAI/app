const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runAnalysis(videoPath) {
  // Navigate two levels up from cli/lib/ to root, then into ml-core
  const rootPath = path.resolve(__dirname, '..', '..');
  const pythonPath = path.join(rootPath, 'ml-core', 'start.py');

  // Check if file actually exists
  if (!fs.existsSync(pythonPath)) {
    console.error(`❌ Could not find start.py at ${pythonPath}`);
    return;
  }

  console.log('Resolved Python path:', pythonPath);
  const python = spawn('python3', [pythonPath, videoPath]);

  python.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  python.stderr.on('data', (data) => {
    console.error(`❌ Error: ${data}`);
  });

  python.on('close', (code) => {
    console.log(`\n✅ Process exited with code ${code}`);
  });
}

module.exports = { runAnalysis };
