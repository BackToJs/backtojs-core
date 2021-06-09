require('nodejs-require-enhancer');

// let SomeTest = require("org/linkstartjs/webpack/scripts/WebpackBuildTest.js");

const SeleniumHelper = require("org/linkstartjs/webpack/scripts/SeleniumHelper.js");
var seleniumHelper = new SeleniumHelper();

seleniumHelper.run().then((serverForTest) => {
  require("org/linkstartjs/webpack/SomeTest.js");
});
