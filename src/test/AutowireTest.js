require('nodejs-require-enhancer');
var chai = require('chai');
require('org/test/common/MochaAutoconfigurator.js');
var webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
var expect = chai.expect;
var assert = chai.assert;
const util = require('util')

describe('@Autowire', function() {
  it('autowire @Page', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl + "#autowirePage")
        .then(function() {
          return driver.wait(until.elementLocated(By.id('root')));
        })
        .then(function(body) {
          return body.getText();
        })
        .then(function(body) {
          assert.equal("I'm the simple html page", body)
          resolve();
        }).catch(function(err) {
          console.log(err);
          reject();
        });
    });
  });
  it('autowire @Module', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl + "#autowireModule")
        .then(function() {
          return driver.wait(until.elementLocated(By.id('root')));
        })
        .then(function(body) {
          return body.getText();
        })
        .then(function(bodyText) {
          expect(bodyText).to.equal("I'm a function of Module");
          resolve();
        }).catch(function(err) {
          console.log(err);
          reject();
        });
    });
  });
  it('autowire dependecyContext', function() {
    /*
    "autowireDependencyContext": {
      "linksStartContext": {},
      "_ls_name": "autowireDependencyContext"
    },
    */
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl + "#autowireDependencyContext")
        .then(function() {
          return driver.wait(until.elementLocated(By.id('root')));
        })
        .then(function(body) {
          return body.getText();
        })
        .then(function(bodyText) {
          console.log(bodyText);
          var bodyAsObject = JSON.parse(bodyText);
          assert(bodyAsObject);
          assert(bodyAsObject["autowireDependencyContext"]);
          assert(bodyAsObject["autowireDependencyContext"]["_ls_name"]);
          assert(bodyAsObject["autowireDependencyContext"]["_ls_name"]);
          expect(bodyAsObject["autowireDependencyContext"]["_ls_name"]).to.equal("autowireDependencyContext");
          resolve();
        }).catch(function(err) {
          console.log(err);
          reject();
        });
    });
  });
  it('autowire metaContext', function() {

    /*
    "autowireMetaContext": {
      "variables": {
        "linksStartContext": [{
          "name": "Autowire",
          "arguments": {
            "name": "linksStartContext"
          }
        }]
      },
      "functions": {}
    },
    */

    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl + "#autowireMetaContext")
        .then(function() {
          return driver.wait(until.elementLocated(By.id('root')));
        })
        .then(function(body) {
          return body.getText();
        })
        .then(function(bodyText) {
          console.log(bodyText);
          var bodyAsObject = JSON.parse(bodyText);
          assert(bodyAsObject);
          assert(bodyAsObject["autowireMetaContext"]);
          assert(bodyAsObject["autowireMetaContext"]["variables"]);
          assert(bodyAsObject["autowireMetaContext"]["variables"]["linksStartContext"]);
          assert(bodyAsObject["autowireMetaContext"]["variables"]["linksStartContext"][0]);
          expect(bodyAsObject["autowireMetaContext"]["variables"]["linksStartContext"][0]["name"]).to.equal("Autowire");
          resolve();
        }).catch(function(err) {
          console.log(err);
          reject();
        });
    });
  });
});
