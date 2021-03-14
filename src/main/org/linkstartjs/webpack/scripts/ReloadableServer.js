require('nodejs-require-enhancer');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = require("org/linkstartjs/logger/Logger.js")
const config = require('org/linkstartjs/webpack/config/WebpackDevConfig.js');

const server = new WebpackDevServer(webpack(config), { });
server.listen(8080);
