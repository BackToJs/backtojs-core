require('nodejs-require-enhancer');
var express = require('express')
var serveStatic = require('serve-static')
var packageFinder = require('find-package-json');
var phantom = require('phantom');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);
var app = express()
const puppeteer = require('puppeteer');

// process.env.LINK_START_LOG_LEVEL = 'debug'
// process.env.META_JS_LOG_LEVEL = 'debug'
process.env.NODE_ENV = 'production'
process.env.LINKS_START_APP_PATH = rootPath+"/src/test/app"

const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();

function WebpackBuildTestPupeter(){

  this.run = function() {
    webpackBuild.run(function(){
      console.log("starting web server for test");
      app.use(serveStatic(process.env.LINKS_START_APP_PATH+"/dist", { 'index': ['index.html'] }))
      app.listen(3000)
      var url = 'http://localhost:3000';

      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        console.log(bodyHTML);
        process.exit(0);
      })();
    });
  };
};

module.exports = WebpackBuildTestPupeter
