#!/usr/bin/env node
//https://gist.github.com/michaelrambeau/b04f83ef16fc78feee09
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack/webpack.dev.js');

const server = new WebpackDevServer(webpack(config), { });
server.listen(8080);
