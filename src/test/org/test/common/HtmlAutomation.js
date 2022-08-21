require('nodejs-require-enhancer');
var express = require('express')
var serveStatic = require('serve-static')
var packageFinder = require('find-package-json');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);
var app = express()

// process.env.LINK_START_LOG_LEVEL = 'debug'
// process.env.META_JS_LOG_LEVEL = 'debug'
process.env.NODE_ENV = 'production'
process.env.LINKS_START_APP_PATH = rootPath+"/src/test/app"

const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();

//https://stackoverflow.com/questions/44197253/headless-automation-with-nodejs-selenium-webdriver

function HtmlAutomation(){

  this.buildAndServe = function() {
    return new Promise(function(resolve, reject) {
      webpackBuild.run().then(function() {
        app.use(serveStatic(process.env.LINKS_START_APP_PATH+"/dist", { 'index': ['index.html'] }))
          const server = app.listen(0, () => {
          var port = server.address().port;
          console.log(`\nTest server with webpack build output is listening on port: ${port}`);
          var baseUrl = `http://localhost:${port}`;

          var webdriver = require('selenium-webdriver'),
              chrome    = require('selenium-webdriver/chrome')
              options   = new chrome.Options();
              options.addArguments('headless'); // note: without dashes
              options.addArguments('disable-gpu')
          var path = require('chromedriver').path;
          var service = new chrome.ServiceBuilder(path).build();
              chrome.setDefaultService(service);
          var pref = new webdriver.logging.Preferences();
          pref.setLevel('browser', webdriver.logging.Level.ALL);
          pref.setLevel('driver', webdriver.logging.Level.ALL);
          var driver = new webdriver.Builder()
              .forBrowser('chrome')
              .withCapabilities(webdriver.Capabilities.chrome())
              .setLoggingPrefs(pref)
              .setChromeOptions(options)                         // note this
              .build();

          resolve({"baseUrl":baseUrl, "driver":driver});
        });
      });//
    });
  };
};

module.exports = HtmlAutomation


// https://docs.skuid.com/latest/en/skuid/testing/example-node/
// https://examples.javacodegeeks.com/enterprise-java/selenium/selenium-nodejs-example/
