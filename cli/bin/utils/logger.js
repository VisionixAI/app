const fs = require('fs');
const path = require('path');

const homeDir = process.env.HOME || process.env.USERPROFILE || __dirname;
const logFilePath = path.resolve(homeDir, 'visionix_postinstall.log');

function safeAppend(filePath, message) {
	try {
		fs.appendFileSync(filePath, message + '\n');
	} catch (_) {
		// Intentionally ignore file write errors to avoid breaking install
	}
}

function write(message) {
	process.stdout.write(message + '\n');
	safeAppend(logFilePath, message);
}

function writeError(message) {
	process.stderr.write(message + '\n');
	safeAppend(logFilePath, message);
}

function getLogFilePath() {
	return logFilePath;
}

module.exports = {
	write,
	writeError,
	getLogFilePath,
};


