require('nodejs-require-enhancer');
var chai = require('chai');
require('org/test/common/MochaAutoconfigurator.js');
var webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
var expect = chai.expect;
var assert = chai.assert;
const util = require('util')

// console.log(util.inspect(body, {showHidden: false, depth: null}))

describe('annotations: @Autowire', function() {
  it('simple page autowire', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#simple-autowire")
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(body) {
        assert.equal("I'm the simple page", body)
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
