#!/usr/bin/env node
require('nodejs-import-helper');
const Logger = include("src/org/linkstartjs/logger/Logger.js")

var args = process.argv.slice(2);

if(args[0] === 'dev'){
  process.env.NODE_ENV = 'development'
  const WebpackDev = include('src/org/linkstartjs/webpack/scripts/WebpackDev.js')
  var webpackDev = new WebpackDev();
  webpackDev.run();
}else if(args[0] === 'build'){
  process.env.NODE_ENV = 'production'
  const WebpackBuild = include('src/org/linkstartjs/webpack/scripts/WebpackBuild.js')
  var webpackBuild = new WebpackBuild();
  webpackBuild.run();
}else{
  console.log("LinkStart.js does not support this argument:"+args[0]);
}
