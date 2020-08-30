require('nodejs-import-helper');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = include("src/org/linkstartjs/logger/Logger.js")
const config = include('src/org/linkstartjs/webpack/config/webpack.dev.js');

const server = new WebpackDevServer(webpack(config), { });
server.listen(8080);
