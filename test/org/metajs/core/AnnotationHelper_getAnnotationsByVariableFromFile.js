require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

var file1 =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire(name="example")
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

describe('AnnotationHelper: getAnnotationsByVariableFromFile', function() {
  it('var has one annotation', function() {
    var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"]
    var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotations);
    var lines = file1.split("\n");
    var foundAnnotations = AnnotationHelper.getAnnotationsByVariableFromFile(lines, internalAnnotations);
    assert(foundAnnotations);
    assert(foundAnnotations.liveExample);
    expect(foundAnnotations.liveExample.length).to.equal(1);
    expect(foundAnnotations.liveExample[0].name).to.equal("Autowire");
    expect(foundAnnotations.liveExample[0].arguments.name).to.equal("example");
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
