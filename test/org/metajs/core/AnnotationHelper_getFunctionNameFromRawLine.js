require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

describe('AnnotationHelper: getFunctionNameFromRawLine', function() {
  it('get simple function name', function() {
    var variableName = AnnotationHelper.getFunctionNameFromRawLine("const displayQuote = () => {");
    expect(variableName).to.equal("displayQuote");
  });
  it('get simple function name with spaces', function() {
    var variableName = AnnotationHelper.getFunctionNameFromRawLine("const   displayQuote   = () => {");
    expect(variableName).to.equal("displayQuote");
  });

  let output;
  const originalLogFunction = console.log;
  beforeEach(function() {
    output = '';
    console.log = (msg) => {
      output += msg + '\n';
    };
  });

  afterEach(function() {
    console.log = originalLogFunction; // undo dummy log function
    if (this.currentTest.state === 'failed') {
      console.log("Log:");
      console.log(output);
    }
  });
});
