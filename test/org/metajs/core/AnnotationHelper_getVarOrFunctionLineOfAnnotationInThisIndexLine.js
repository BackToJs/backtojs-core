require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

var file1 =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire
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

describe('Get line var which has annotations', function() {
  it('#1 if var has one annotation should get the real var', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    expect(AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine(file1, 3, internalAnnotationsRegexString)).to.equal("  var liveExample;");
  });
  it('#2 if var has two annotations should get the real var', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    expect(AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine(file2, 3, internalAnnotationsRegexString)).to.equal("  var liveExample;");
  });

  it('#3 if var has several annotations should get the real var', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    expect(AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine(file3, 3, internalAnnotationsRegexString)).to.equal("  var template;");
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
