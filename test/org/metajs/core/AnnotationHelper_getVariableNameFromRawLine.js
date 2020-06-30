require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

describe('AnnotationHelper: getVariableNameFromRawLine', function() {
  it('get simple variable name', function() {
    var variableName = AnnotationHelper.getVariableNameFromRawLine("var duke;");
    expect(variableName).to.equal("duke");
  });
  it('get simple variable name with spaces', function() {
    var variableName = AnnotationHelper.getVariableNameFromRawLine("  var  duke   ;   ");
    expect(variableName).to.equal("duke");
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
