require('nodejs-require-enhancer');
var chai = require('chai');
require('org/test/common/MochaAutoconfigurator.js');
var webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
var expect = chai.expect;
var assert = chai.assert;
const util = require('util')

describe('@DefaultAction', function() {
  it('entrypoint must be triggered if entrypoint="true"', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl)
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(bodyText) {
        var bodyAsObject = JSON.parse(bodyText);
        assert(bodyAsObject);
        assert(bodyAsObject.lifeCycle);
        expect(bodyAsObject.lifeCycle.length).to.equal(2);
        expect(bodyAsObject.lifeCycle[0]).to.equal("onLoad");
        expect(bodyAsObject.lifeCycle[1]).to.equal("render");
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
  it('action must be triggered if its route is used', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#entrypoint")
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(bodyText) {
        var bodyAsObject = JSON.parse(bodyText);
        assert(bodyAsObject);
        assert(bodyAsObject.lifeCycle);
        expect(bodyAsObject.lifeCycle.length > 2).to.equal(true);
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
