const include = require('nodejs-require-enhancer');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = include("org/linkstartjs/logger/Logger.js")
const config = include('org/linkstartjs/webpack/config/webpack.dev.js');

const server = new WebpackDevServer(webpack(config), { });
server.listen(8080);
