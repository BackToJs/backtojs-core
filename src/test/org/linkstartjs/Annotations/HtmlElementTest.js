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
var logging = require('selenium-webdriver').logging;

describe('@HtmlElementTest', function() {
  it('input binding', function() {
    let driver = _liveHtmlDomTools.driver;
    return new Promise((resolve, reject) => {
      driver.get(_liveHtmlDomTools.baseUrl+"#htmlElementAction")
      .then(function() {
        return driver.manage().logs().get(logging.Type.BROWSER);
      })
      .then(function(entries) {
        // console.log(entries);
        entries.forEach(function(entry) {
          // console.log(`[${entry.level.name}] ${entry.message}`);
          var message = entry.message.split("\\s").slice(2);
          console.log(message);
        });
        expect(entries).to.equal("I'm an action which is the entrypoint");
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });
  });
});
