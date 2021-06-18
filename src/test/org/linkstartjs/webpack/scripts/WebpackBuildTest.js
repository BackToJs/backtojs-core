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
  it('entrypoint onLoad()', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl)
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(body) {
        assert.equal("I'm the onLoad of the entrypoint action", body)
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
  it('simple route', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#entrypoint")
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(body) {
        assert.equal("I'm the onLoad of the entrypoint action", body)
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
