require('nodejs-require-enhancer');
var express = require('express')
var serveStatic = require('serve-static')
var packageFinder = require('find-package-json');
var phantom = require('phantom');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);
var app = express()
var casper = require('casper').create();

// process.env.LINK_START_LOG_LEVEL = 'debug'
// process.env.META_JS_LOG_LEVEL = 'debug'
process.env.NODE_ENV = 'production'
process.env.LINKS_START_APP_PATH = rootPath+"/src/test/app"
const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();
webpackBuild.run(function(){
  console.log("start server for test");
  console.log(casper);
  app.use(serveStatic(process.env.LINKS_START_APP_PATH+"/dist", { 'index': ['index.html'] }))
  app.listen(3000)
  var url = 'http://localhost:3000/';
  casper.start(url);

  casper.then(function() {
      this.echo('First Page: ' + this.getTitle());
  });

  casper.run();

});

function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t)
  });
}
