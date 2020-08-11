require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var path = require("path");
const fileUtils = require('fs')
const EntrypointModuleCreator = include('src/org/linkstartjs/webpack/loader/EntrypointModuleCreator.js');
var entrypointModuleCreator = new EntrypointModuleCreator();

describe('EntrypointModuleCreator: createModule', function() {
  it('empty action', function() {

    global.linkStartLoaderLogLevel = "debug";
    var src = path.resolve(__filename,'..')+'/test1/src';
    var opts = {
      "srcLocation":src
    }
    var contentPath = path.resolve(__filename,'..')+'/test1/src/index.js';
    var content = fileUtils.readFileSync(contentPath, 'utf8');

    var moduleString = entrypointModuleCreator.createModule(opts,content);
    assert(moduleString);

  });



  // let output;
  // const originalLogFunction = console.log;
  // beforeEach(function() {
  //   output = '';
  //   console.log = (msg) => {
  //     output += msg + '\n';
  //   };
  // });
  //
  // afterEach(function() {
  //   console.log = originalLogFunction; // undo dummy log function
  //   if (this.currentTest.state === 'failed') {
  //     console.log("Log:");
  //     console.log(output);
  //   }
  // });
});
