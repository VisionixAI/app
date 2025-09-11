console.log("hi there")


const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const logFile = path.resolve(process.env.HOME || process.env.USERPROFILE || __dirname, 'visionix_postinstall.log');

function logToFile(msg) {
    try {
        fs.appendFileSync(logFile, msg + '\n');
    } catch (e) {
        // ignore file write errors
    }
}

function flushLog(msg) {
    process.stdout.write(msg + '\n');
    logToFile(msg);
}

console.log('[VisionixAI] 🧠 Installing Python dependencies...');


function flushLog(msg) {
    process.stdout.write(msg + '\n');
    process.stdout.write('');
}

function tryCommand(cmd, desc, timeoutMs = 60000) {
    flushLog(`[VisionixAI] [ENTER] tryCommand: ${desc || cmd}`);
    flushLog(`\n[VisionixAI] $ ${cmd}`);
    try {
        flushLog(`[VisionixAI] [RUNNING] ${cmd}`);
        const output = execSync(cmd, { stdio: 'inherit', timeout: timeoutMs });
        flushLog(`[VisionixAI] [SUCCESS] ${cmd}`);
        if (desc) flushLog(`[VisionixAI] ${desc} succeeded.`);
        flushLog(`[VisionixAI] [EXIT] tryCommand: ${desc || cmd}`);
        return true;
    } catch (err) {
        flushLog(`[VisionixAI] [ERROR] ${desc || cmd} failed.`);
        if (err.stdout) flushLog('[VisionixAI] [STDOUT] ' + err.stdout.toString());
        if (err.stderr) flushLog('[VisionixAI] [STDERR] ' + err.stderr.toString());
        flushLog(`[VisionixAI] [EXIT] tryCommand: ${desc || cmd}`);
        return false;
    }
}

function printPythonPipInstructions() {
    flushLog(`[VisionixAI] [ENTER] printPythonPipInstructions`);
    flushLog(`\n[VisionixAI] ❌ Python and pip are required to install ML dependencies.\n`);
    flushLog(`[VisionixAI] Please install Python (https://www.python.org/downloads/) and ensure pip is available in your PATH.\n`);
    flushLog(`[VisionixAI] After installing, run the following command to finish setup:`);
    flushLog(`    pip install -r <path-to-requirements.txt>\n`);
    flushLog(`[VisionixAI] [EXIT] printPythonPipInstructions`);
}


flushLog('[VisionixAI] [ENTER] postinstall main');
flushLog(`[VisionixAI] CWD: ${process.cwd()}`);
flushLog(`[VisionixAI] Log file: ${logFile}`);
flushLog('[VisionixAI] NOTE: Installing Python dependencies (like opencv-python, mediapipe) can take several minutes depending on your internet speed. Please be patient.');
flushLog('[VisionixAI] Checking for Python and pip...');
const hasPython = tryCommand('python --version', 'Python version') || tryCommand('python3 --version', 'Python3 version');
flushLog(`[VisionixAI] hasPython: ${hasPython}`);
const hasPip = tryCommand('pip --version', 'pip version') || tryCommand('pip3 --version', 'pip3 version');
flushLog(`[VisionixAI] hasPip: ${hasPip}`);

if (!hasPython || !hasPip) {
    flushLog('[VisionixAI] Python or pip not found. Exiting.');
    printPythonPipInstructions();
    flushLog('[VisionixAI] [EXIT] postinstall main');
    process.exit(1);
}

flushLog('[VisionixAI] Python and pip found. Installing ML dependencies...');
const reqPath = path.resolve(__dirname, '../ml-core/requirements.txt');
let installed = false;
flushLog(`[VisionixAI] Installing requirements from: ${reqPath}`);
if (!installed) {
    flushLog('[VisionixAI] [BEFORE] pip install');
    installed = tryCommand(`pip install -r "${reqPath}"`, 'pip install', 120000);
    flushLog('[VisionixAI] [AFTER] pip install');
}
if (!installed) {
    flushLog('[VisionixAI] [BEFORE] pip3 install');
    installed = tryCommand(`pip3 install -r "${reqPath}"`, 'pip3 install', 120000);
    flushLog('[VisionixAI] [AFTER] pip3 install');
}

if (installed) {
    flushLog('\n[VisionixAI] ✅ Python dependencies installed!');
} else {
    flushLog('\n[VisionixAI] ❌ Failed to install Python dependencies. Please ensure Python and pip are installed and available in your PATH.');
    printPythonPipInstructions();
}

flushLog(`[VisionixAI] [EXIT] postinstall main`);
flushLog(`\n[VisionixAI] Installation complete!\n`);
flushLog(`[VisionixAI] CWD: ${process.cwd()}`);
flushLog(`[VisionixAI] Log file: ${logFile}`);