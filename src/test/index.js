require('nodejs-require-enhancer');
//run mocha programatically
//https://stackoverflow.com/a/29802434/3957754
var Mocha = require('mocha');
var mocha = new Mocha({});
var packageFinder = require('find-package-json');
var path = require('path');
var rootPath = path.dirname(packageFinder(__dirname).next().filename);

mocha.addFile(rootPath+'/src/test/org/linkstartjs/webpack/util/WebpackUtilTest.js')
mocha.addFile(rootPath+'/src/test/org/linkstartjs/webpack/scripts/WebpackBuildTest.js')

const HtmlAutomation = require("org/test/common/HtmlAutomation.js");
var htmlAutomation = new HtmlAutomation();

htmlAutomation.buildAndServe().then((liveHtmlDomTools) => {
  global._liveHtmlDomTools = liveHtmlDomTools;
  mocha.run() .on('end', function() {
    process.exit(0);
  });
});
