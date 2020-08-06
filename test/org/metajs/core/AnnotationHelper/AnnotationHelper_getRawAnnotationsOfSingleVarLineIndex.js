require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

var file1 =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire(name="name")
  var liveExample;

  function dummy(){};`;

var file2 =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire(name="name")
  //@Render(name="name")
  var liveExample;

  function dummy(){};`;

var file3 =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire(name="name")
  //@Render(name="name")
  //@ActionListener(name="name")
  var template;

  function dummy(){};`;

describe('Get annotations of var', function() {
  it('var has one annotation', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    var lines = file1.split("\n");
    var foundRawAnnotations = AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex(lines, 4, internalAnnotationsRegexString);
    assert(foundRawAnnotations);
    expect(foundRawAnnotations.length).to.equal(1);
    expect(foundRawAnnotations[0]).to.equal('  //@Autowire(name="name")');
  });
  it('var has two annotations', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    var lines = file2.split("\n");
    var foundRawAnnotations = AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex(lines, 5, internalAnnotationsRegexString);
    assert(foundRawAnnotations);
    expect(foundRawAnnotations.length).to.equal(2);
    expect(foundRawAnnotations[0]).to.equal('  //@Render(name="name")');
    expect(foundRawAnnotations[1]).to.equal('  //@Autowire(name="name")');
  });
  it('var has three annotations', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    var lines = file3.split("\n");
    var foundRawAnnotations = AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex(lines, 6, internalAnnotationsRegexString);
    assert(foundRawAnnotations);
    expect(foundRawAnnotations.length).to.equal(3);
    expect(foundRawAnnotations[0]).to.equal('  //@ActionListener(name="name")');
    expect(foundRawAnnotations[1]).to.equal('  //@Render(name="name")');
    expect(foundRawAnnotations[2]).to.equal('  //@Autowire(name="name")');
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
