require('nodejs-require-enhancer');
const Assert = require('assert-js');
var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;

function EntrypointTest() {

  this.route = "";

  this.test = async function(baseUrl, driver) {
    await driver.get(`${baseUrl}${this.route}`);
    var rootText = await driver.findElement(By.id('root')).getText();
    Assert.equal(rootText,"I'm the onLoad", `Entryoint must be loaded and return: I'm the onLoad`);
  }

}

module.exports = EntrypointTest
