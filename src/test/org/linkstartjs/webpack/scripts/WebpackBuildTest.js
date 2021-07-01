require('nodejs-require-enhancer');
var chai = require('chai');
require('org/test/common/MochaAutoconfigurator.js');
var expect = chai.expect;
var assert = chai.assert;
const fs = require('fs');

var appDir = process.env.LINKS_START_APP_PATH;

describe('org/linkstartjs/webpack/scripts/WebpackBuild.js : run', function() {
  it('dist folder must exist and have 3 items: js/* favicon.ico index.html', function() {
    fs.readdir(appDir+"/dist", (err, files) => {
      assert.equal(files.length,3)
    });
  });
  it('dist/js folder have 2 items: app.***.js app.***.js.map ', function() {
    fs.readdir(appDir+"/dist/js", (err, files) => {
      assert.equal(files.length,2)
    });
  });
  it('served page at least must contain the title', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl)
      .then(function() {
        return driver.getTitle();
      })
      .then(function(title) {
        assert.equal("Link Start Js", title)
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
