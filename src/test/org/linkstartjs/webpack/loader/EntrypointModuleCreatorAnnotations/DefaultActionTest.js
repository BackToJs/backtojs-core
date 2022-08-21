require('nodejs-require-enhancer');
var chai = require('chai');
require('org/test/common/MochaAutoconfigurator.js');
var webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const element = webdriver.element;
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
        expect(bodyText).to.equal("I'm an action which is the entrypoint");
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
        expect(bodyText).to.equal("I'm an action which is the entrypoint");
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });

  it('unkown route', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#foo-bar")
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(body) {
        return body.getText();
      })
      .then(function(bodyText) {
        console.log(bodyText);
        expect(bodyText).to.equal("There are not any @DefaultAction asociated to this route: foo-bar");
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });

  it('route with registered page', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#defaultActionWithPage")
      .then(function() {
        return driver.wait(until.elementLocated(By.id('root')));
      })
      .then(function(root) {
        return root.getAttribute("innerHTML");
      })
      .then(function(innerHTML) {
        expect(innerHTML).to.equal('<button type="button">Click Me!</button>');
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
