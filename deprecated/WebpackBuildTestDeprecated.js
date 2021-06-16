require('nodejs-require-enhancer');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

const SeleniumHelper = require("org/linkstartjs/webpack/scripts/SeleniumHelper.js");
var seleniumHelper = new SeleniumHelper();

const originalLogFunction = console.log;
let output='';
console.log= function(message){
  output += message + '\n';
}

describe('# org/linkstartjs/webpack/scripts/WebpackBuild.js', () => {


  var driver;
  var baseUrl;
  before(() => {
    return new Promise((resolve) => {
      seleniumHelper.run().then((serverForTest) => {
        driver = serverForTest.driver;
        baseUrl = serverForTest.baseUrl;
        resolve();
      });
    });
  });

  it('entrypoint', () => {
    return new Promise((resolve, reject) => {
      driver.get("http://www.google.com")
      .then(function() {
        return driver.getTitle();
      })
      .then(function(title) {
        assert.equal("Google", title)
        resolve();
      }).catch(function(err){
        originalLogFunction("\nError:\n");
        originalLogFunction(err);
        originalLogFunction("\nPrevious Log:");
        originalLogFunction(output);
        output="";
        reject();
      });
    });
  })
})


// https://docs.skuid.com/latest/en/skuid/testing/example-node/
// https://examples.javacodegeeks.com/enterprise-java/selenium/selenium-nodejs-example/
