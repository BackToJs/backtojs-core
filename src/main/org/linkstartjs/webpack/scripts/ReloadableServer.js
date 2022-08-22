const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = require("../../logger/Logger.js")
const config = require('../config/WebpackDevConfig.js');

const server = new WebpackDevServer({}, webpack(config));
var port = process.env.PORT || 8080;
server.listen(port);
console.log(`Project is running at: http://localhost:${port}`)
