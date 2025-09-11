const path = require('path');

function getHomeDir() {
	return process.env.HOME || process.env.USERPROFILE || process.cwd();
}

function getVenvDir() {
	return path.resolve(getHomeDir(), '.visionix-venv');
}

function getVenvPythonPath() {
	const venv = getVenvDir();
	if (process.platform === 'win32') return path.join(venv, 'Scripts', 'python.exe');
	return path.join(venv, 'bin', 'python');
}

function getVenvPipPath() {
	const venv = getVenvDir();
	if (process.platform === 'win32') return path.join(venv, 'Scripts', 'pip.exe');
	return path.join(venv, 'bin', 'pip');
}

function getRuntimeConfigPath() {
	return path.resolve(__dirname, '..', 'runtime-config.json');
}

module.exports = {
	getHomeDir,
	getVenvDir,
	getVenvPythonPath,
	getVenvPipPath,
	getRuntimeConfigPath,
};


