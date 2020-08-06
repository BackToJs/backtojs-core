require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

describe('AnnotationHelper: isVariable', function() {
  it('is a simple variable at the left', function() {
    var isVariable = AnnotationHelper.isVariable("var duke;");
    expect(isVariable).to.equal(true);
  });
  it('is a simple variable with spaces at the start', function() {
    var isVariable = AnnotationHelper.isVariable("   var duke;");
    expect(isVariable).to.equal(true);
  });
  it('is a simple variable with spaces after name', function() {
    var isVariable = AnnotationHelper.isVariable("   var duke  ;");
    expect(isVariable).to.equal(true);
  });
  it('is not a variable declaration', function() {
    var isVariable = AnnotationHelper.isVariable("   var _duke  ;");
    expect(isVariable).to.equal(false);
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
