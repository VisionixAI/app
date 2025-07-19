const { execSync } = require('child_process');
const path = require('path');

const requirements = path.join(__dirname, '..', '..', 'ml-core', 'requirements.txt');
const venvDir = path.join(__dirname, '..', '.visionix-venv');

try {
  console.log('[VisionixAI] Creating Python virtual environment...');
  execSync(`python3 -m venv ${venvDir}`, { stdio: 'inherit' });

  console.log('[VisionixAI] Installing Python dependencies...');
  execSync(`${venvDir}/bin/pip install -r ${requirements}`, { stdio: 'inherit' });

  console.log('✅ ML features are ready to use!');
} catch (e) {
  console.error('❌ Failed to set up ML environment:', e.message);
}
