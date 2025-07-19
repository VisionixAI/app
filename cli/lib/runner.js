const { spawn } = require('child_process');
const path = require('path');

function runCVServer() {
  const python = spawn('python3', [path.join(__dirname, '../../ml-core/app.py')]);

  python.stdout.on('data', (data) => {
    console.log(`[Python] ${data}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`[Python Error] ${data}`);
  });

  python.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}

module.exports = { runCVServer };
