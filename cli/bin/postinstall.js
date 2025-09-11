
const { execSync } = require('child_process');
const path = require('path');

console.log('[VisionixAI] 🧠 Installing Python dependencies...');

try {
    // Find the path to requirements.txt relative to this script
    const reqPath = path.resolve(__dirname, '../ml-core/requirements.txt');
    execSync(`pip install -r "${reqPath}"`, { stdio: 'inherit' });
    console.log('\n[VisionixAI] Python dependencies installed!');
} catch (err) {
    console.error('\n[VisionixAI] Failed to install Python dependencies. Please ensure Python and pip are installed.');
}

console.log(`\n[VisionixAI] Installation complete!\n`);