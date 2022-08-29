const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = require("../../logger/Logger.js")
const commonConfig = require('../config/WebpackCommonConfig.js');
const devConfig = require('../config/WebpackDevConfig.js');

const compiler = webpack({...commonConfig, mode: 'development'});
const server = new WebpackDevServer(devConfig, compiler);

console.log('Starting server...');
server.start();