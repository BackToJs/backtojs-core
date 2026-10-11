#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

// Get the command from the CLI arguments (e.g., 'dev' or 'build')
const command = process.argv[2];

// Path to the root of the back2js-core library where configs are located
const libRoot = path.resolve(__dirname, '../../');

function runWebpackCommand(nodeEnv, executable, args) {
  console.log(`Running back2js ${command}...`);
  
  // Set the NODE_ENV programmatically instead of using cross-env
  const env = { ...process.env, NODE_ENV: nodeEnv };

  // Spawn the command (npx will find webpack/webpack-dev-server in node_modules)
  const result = spawnSync('npx', [executable, ...args], {
    stdio: 'inherit',
    env: env,
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  process.exit(result.status);
}

if (command === 'dev') {
  const configPath = path.join(libRoot, 'webpack.dev.config.js');
  runWebpackCommand(
    'development',
    'webpack-dev-server',
    ['--progress', '--config', configPath]
  );
} else if (command === 'build') {
  const configPath = path.join(libRoot, 'webpack.prod.config.js'); // Assuming you have a prod config for build
  runWebpackCommand(
    'production',
    'webpack',
    ['--progress', '--config', configPath]
  );
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Usage: back2js <dev|build>');
  process.exit(1);
}
