require('nodejs-require-enhancer');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
require('org/test/common/MochaAutoconfigurator.js');

describe('org/linkstartjs/webpack/scripts/WebpackBuild.js : run', function() {
  it('at least must contain the title', function() {
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
