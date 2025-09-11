const { execSync } = require('child_process');
const path = require('path');
const { write, writeError, getLogFilePath } = require('./utils/logger');
const fs = require('fs');
const { getVenvDir, getVenvPythonPath, getVenvPipPath, getRuntimeConfigPath } = require('./utils/paths');

function log(msg) { write(msg); }
function logErr(msg) { writeError(msg); }

function tryCommand(cmd, desc, timeoutMs) {
	log(`[VisionixAI] [ENTER] tryCommand: ${desc || cmd}`);
	log(`[VisionixAI] $ ${cmd}`);
	try {
		execSync(cmd, { stdio: 'inherit', timeout: timeoutMs || 60000 });
		log(`[VisionixAI] [SUCCESS] ${desc || cmd}`);
		log(`[VisionixAI] [EXIT] tryCommand: ${desc || cmd}`);
		return true;
	} catch (err) {
		logErr(`[VisionixAI] [ERROR] ${desc || cmd} failed.`);
		if (err && err.message) logErr(`[VisionixAI] ${err.message}`);
		log(`[VisionixAI] [EXIT] tryCommand: ${desc || cmd}`);
		return false;
	}
}

function printPythonPipInstructions(reqPathHint) {
	log('[VisionixAI] ❌ Python and pip are required to install ML dependencies.');
	log('[VisionixAI] Install Python: https://www.python.org/downloads/');
	log('[VisionixAI] Ensure pip is available in your PATH.');
	if (reqPathHint) {
		log('[VisionixAI] After installing, run:');
		log(`    pip install -r "${reqPathHint}"`);
	}
}

function resolveFirstSuccessful(commands) {
	for (const { cmd, desc } of commands) {
		if (tryCommand(cmd, desc)) return cmd; // return full invoker, e.g., 'py -3'
	}
	return null;
}

(function main() {
	log('[VisionixAI] [ENTER] postinstall main');
	log(`[VisionixAI] CWD: ${process.cwd()}`);
	log(`[VisionixAI] Log file: ${getLogFilePath()}`);
	log('[VisionixAI] WARNING: Python dependency installation can take several minutes. Please be patient.');

	log('[VisionixAI] Checking for Python and pip...');
	const pythonInvoker = resolveFirstSuccessful([
		{ cmd: 'python --version', desc: 'Python version' },
		{ cmd: 'python3 --version', desc: 'Python3 version' },
		{ cmd: 'py -3 --version', desc: 'Windows Python Launcher (py -3) version' },
	]);
	const pipOk = tryCommand('pip --version', 'pip version') || tryCommand('pip3 --version', 'pip3 version') || (pythonInvoker ? tryCommand(`${pythonInvoker.replace(' --version', '')} -m pip --version`, 'python -m pip version') : false);
	log(`[VisionixAI] pythonInvoker: ${pythonInvoker || 'not found'}`);
	log(`[VisionixAI] pipPresent: ${pipOk}`);

	const reqPath = path.resolve(__dirname, '../ml-core/requirements.txt');
	if (!pythonInvoker || !pipOk) {
		logErr('[VisionixAI] Python or pip not found.');
		printPythonPipInstructions(reqPath);
		log('[VisionixAI] [EXIT] postinstall main');
		process.exit(1);
	}

	log('[VisionixAI] Installing ML Python dependencies...');
	log(`[VisionixAI] Requirements: ${reqPath}`);

	let installed = false;

	// Create per-user venv and install into it for consistency
	const venvDir = getVenvDir();
	const venvPython = getVenvPythonPath();
	const venvPip = getVenvPipPath();
	const inv = pythonInvoker.replace(' --version', '');

	if (!fs.existsSync(venvDir)) {
		log(`[VisionixAI] Creating virtual environment at: ${venvDir}`);
		installed = tryCommand(`${inv} -m venv "${venvDir}"`, 'Create virtualenv', 5 * 60 * 1000);
		if (!installed) {
			logErr('[VisionixAI] Failed to create virtual environment. Falling back to system pip.');
		}
	}

	if (fs.existsSync(venvPip)) {
		log('[VisionixAI] Installing requirements into virtual environment...');
		installed = tryCommand(`"${venvPip}" install -r "${reqPath}"`, 'venv pip install requirements', 15 * 60 * 1000);
	} else {
		// Try system pip variants
		installed = installed || tryCommand(`pip install -r "${reqPath}"`, 'pip install requirements', 10 * 60 * 1000);
		installed = installed || tryCommand(`pip3 install -r "${reqPath}"`, 'pip3 install requirements', 10 * 60 * 1000);
		installed = installed || tryCommand(`${inv} -m pip install -r "${reqPath}"`, `${inv} -m pip install requirements`, 10 * 60 * 1000);
	}

	// Persist runtime config pointing to venv Python if available
	try {
		const rcPath = getRuntimeConfigPath();
		const cfg = { venvPython: fs.existsSync(venvPython) ? venvPython : null };
		fs.writeFileSync(rcPath, JSON.stringify(cfg, null, 2));
		log(`[VisionixAI] Wrote runtime config: ${rcPath}`);
	} catch (e) {
		logErr('[VisionixAI] Failed to write runtime config (non-fatal).');
	}

	if (installed) {
		log('[VisionixAI] ✅ Python dependencies installed successfully.');
		log('[VisionixAI] You are all set!');
	} else {
		logErr('[VisionixAI] ❌ Failed to install Python dependencies.');
		printPythonPipInstructions(reqPath);
		logErr('[VisionixAI] See the log file for details.');
	}

	log('[VisionixAI] [EXIT] postinstall main');
})();