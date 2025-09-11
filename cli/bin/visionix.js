#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.length < 1 || args.includes('--help')) {
  console.log(`
VISIONIX AI CLI

Welcome to the Visionix AI Command Line Interface!
Streamline your workflows and leverage AI capabilities seamlessly.

`);
  process.exit(0);
}

