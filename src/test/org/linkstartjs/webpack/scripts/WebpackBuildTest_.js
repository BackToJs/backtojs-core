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
  // 'org/linkstartjs/webpack/features/OnloadTest.js'
];

const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();

//https://stackoverflow.com/questions/44197253/headless-automation-with-nodejs-selenium-webdriver

function WebpackBuildTestPupeter(){

  this.run = function() {
    webpackBuild.run(function(){
      app.use(serveStatic(process.env.LINKS_START_APP_PATH+"/dist", { 'index': ['index.html'] }))
        const server = app.listen(0, () => {
        var port = server.address().port;
        console.log(`Test server listening on port:${port}`);
        var baseUrl = `http://localhost:${port}`;

        var webdriver = require('selenium-webdriver'),
            chrome    = require('selenium-webdriver/chrome')
            By        = webdriver.By,
            until     = webdriver.until,
            options   = new chrome.Options();
            options.addArguments('headless'); // note: without dashes
            options.addArguments('disable-gpu')
        var path = require('chromedriver').path;
        var service = new chrome.ServiceBuilder(path).build();
            chrome.setDefaultService(service);
        var driver = new webdriver.Builder()
            .forBrowser('chrome')
            .withCapabilities(webdriver.Capabilities.chrome())
            .setChromeOptions(options)                         // note this
            .build();

        for(test of tests){
          try{
            let SomeTest = require(test);
            let instancedTest = new SomeTest();
            // let urlToTest = instancedTest.getRoute();
            // urlToTest = baseUrl + urlToTest;
            // driver.get(baseUrl);
            instancedTest.test(baseUrl,driver);

          }catch(err){
            console.log(err);
          }
        }
        // console.log(">>>>>>>>>>>>>>>>>>>");
        // process.exit(0);
        // (async () => {
        //   const browser = await puppeteer.launch();
        //   const page = await browser.newPage();
        //
        // })();
      });
    });
  };
};

module.exports = WebpackBuildTestPupeter


// https://docs.skuid.com/latest/en/skuid/testing/example-node/
// https://examples.javacodegeeks.com/enterprise-java/selenium/selenium-nodejs-example/
