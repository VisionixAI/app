#!/usr/bin/env node


// Use chalk for colors
let chalk;
try {
  chalk = require('chalk');
} catch (e) {
  chalk = null;
}

const args = process.argv.slice(2);

if (args.length < 1 || args.includes('--help')) {
  const asciiArt = [
    '    __     ___     _             _           _    ___ ',
    '    \\     / (_)___(_) ___  _ __ (_)_  __    / \\  |_ _|',
    '     \\ \\ / /| / __| |/ _ \\| \'_ \\| \\/   /   / _ \\  | | ',
    '      \\ V / | \\__ \\ | (_) | | | | |<  <   / ___ \\ | | ',
    '       \\_/  |_|___/_|\\___/|_| |_|_|_/\\_\\ /_/   \\_\\___|',
  ].join('\n');
  const description = '        Welcome to the Visionix AI Command Line Interface!\n.        Streamline your workflows and leverage AI capabilities seamlessly.';
  if (chalk) {
    console.log(chalk.cyanBright(asciiArt));
    console.log(chalk.bold.magenta('VISIONIX AI CLI\n'));
    console.log(chalk.white(description));
  } else {
    console.log(asciiArt);
    console.log('        VISIONIX AI CLI\n');
    console.log(description);
  }
  process.exit(0);
}

