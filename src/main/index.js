#!/usr/bin/env node

const Logger = require("./org/linkstartjs/logger/Logger.js")
const LinkStartUtil = require("./org/linkstartjs/util/LinkStartUtil.js")
var args = process.argv.slice(2);
var linkStartUtil = new LinkStartUtil();
linkStartUtil.configureGlobalLocations();

if(args[0] === 'dev'){
  process.env.NODE_ENV = 'development'
  const WebpackDev = require('./org/linkstartjs/webpack/scripts/WebpackDev.js')
  var webpackDev = new WebpackDev();
  webpackDev.run();
}else if(args[0] === 'build'){
  process.env.NODE_ENV = 'production'
  const WebpackBuild = require('./org/linkstartjs/webpack/scripts/WebpackBuild.js')
  var webpackBuild = new WebpackBuild();
  webpackBuild.run().then(function(data) {
    Logger.info(`Build content: `+data)
  });
}else if(args[0] === 'start'){
  process.env.NODE_ENV = 'production'
  const LinkstartSpaServer = require('./org/linkstartjs/webpack/scripts/LinkstartSpaServer.js')
  var linkstartSpaServer = new LinkstartSpaServer();
  linkstartSpaServer.run("dist", "src/settings.json", true).then(function() {
    Logger.info("web is ready to use")
  });
}else{
  console.log("LinkStart.js does not support this argument:"+args[0]);
}
