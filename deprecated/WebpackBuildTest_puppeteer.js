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

var tests = [
  'org/linkstartjs/webpack/features/EntrypointTest.js',
  'org/linkstartjs/webpack/features/OnloadTest.js'
];

const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();

function WebpackBuildTestPupeter(){

  this.run = function() {
    webpackBuild.run(function(){
      app.use(serveStatic(process.env.LINKS_START_APP_PATH+"/dist", { 'index': ['index.html'] }))
        const server = app.listen(0, () => {
        var port = server.address().port;
        console.log(`Test server listening on port:${port}`);
        var baseUrl = `http://localhost:${port}`;
        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          for(test of tests){
            try{
              let SomeTest = require(test);
              let instancedTest = new SomeTest();
              let urlToTest = instancedTest.getRoute();
              urlToTest = baseUrl + urlToTest;
              console.log("route to test:"+urlToTest);
              await page.goto(urlToTest);
              let htmlBody = await page.evaluate(() => document.body.innerHTML);
              instancedTest.test(htmlBody);

            }catch(err){
              console.log(err);
            }
          }
          process.exit(0);
        })();
      });
    });
  };
};

module.exports = WebpackBuildTestPupeter
