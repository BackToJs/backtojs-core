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

describe('#getFoo', () => {


  var driver;
  var baseUrl;
  before(() => {
    // console.log = function () {};
    return new Promise((resolve) => {
      seleniumHelper.run().then((serverForTest) => {
        driver = serverForTest.driver;
        baseUrl = serverForTest.baseUrl;
        resolve();
      });
    });
  });

  it('resolves with foo', () => {
    return new Promise((resolve, reject) => {
      driver.get("http://www.google.com")
      .then(function() {
        return driver.getTitle();
      })
      .then(function(title) {
        assert.equal("Google", title)
        resolve();
      }).catch(function(err){
        console.log(err);
        reject();
      });
    });

  })

  // beforeEach(function() {
  //   output = '';
  //   console.log = (msg) => {
  //     output += msg + '\n';
  //   };
  // });

  // afterEach(function() {
  //   console.log(this.currentTest.state);
  //   // console.log = originalLogFunction; // undo dummy log function
  //   // if (this.currentTest.state === 'failed') {
  //   //   console.log("Log:");
  //   //   console.log(output);
  //   // }
  // });
})


// https://docs.skuid.com/latest/en/skuid/testing/example-node/
// https://examples.javacodegeeks.com/enterprise-java/selenium/selenium-nodejs-example/
