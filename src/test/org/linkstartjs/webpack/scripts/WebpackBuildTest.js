require('nodejs-require-enhancer');
var express = require('express')
var serveStatic = require('serve-static')
var packageFinder = require('find-package-json');
// var phantom = require('phantom');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);
// var app = express()
const { JSDOM } = require('jsdom');
const options = {
  resources: 'usable',
  runScripts: 'dangerously',
};


// process.env.LINK_START_LOG_LEVEL = 'debug'
// process.env.META_JS_LOG_LEVEL = 'debug'
process.env.NODE_ENV = 'production'
process.env.LINKS_START_APP_PATH = rootPath+"/src/test/app"
const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();
webpackBuild.run(function(){
  console.log("linkstart unit test is starting");
  JSDOM.fromFile(process.env.LINKS_START_APP_PATH+"/dist/index.html", options).then((dom) => {
    console.log(dom.window.document.body.textContent.trim());

    setTimeout(() => {
      console.log(dom.window.document.body.textContent.trim());
    }, 5000);
  });
});
