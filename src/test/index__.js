require('nodejs-require-enhancer');

//tests
// require('org/linkstartjs/webpack/scripts/WebpackBuildTest.js');
var packageFinder = require('find-package-json');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);

// process.env.LINK_START_LOG_LEVEL = 'debug'
// process.env.META_JS_LOG_LEVEL = 'debug'
process.env.NODE_ENV = 'production'
process.env.LINKS_START_APP_PATH = rootPath+"/src/test/app"

const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
var webpackBuild = new WebpackBuild();
webpackBuild.run().then(function() {
  
});
