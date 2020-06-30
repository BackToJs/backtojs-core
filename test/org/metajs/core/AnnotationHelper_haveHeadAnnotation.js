process.env.NODE_ENV = 'test';

require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

var file1 =
  `//@Page(name="name")
function AcmeAction() {
  var $ = this;

  //@Autowire
  var liveExample;

  function dummy(){};`;

var file2 =
  `//@Action(name="name")
function AcmeAction() {
  var $ = this;

  //@Autowire
  var liveExample;

  function dummy(){};`;

var file3 =
  `//@Dummy(name="name")
function AcmeAction() {
  var $ = this;

  //@Autowire
  var liveExample;

  function dummy(){};`;

//TODO: add extra validation to ensure that these head anottations
// are in the top of the file
describe('detect head annotations ', function() {
  var headAnnotations = ["Page", "Action"]
  it('must have @Page annotation', function() {
    var haveHeadAnnotation = AnnotationHelper.haveHeadAnnotation(file1, headAnnotations);
    expect(haveHeadAnnotation).to.equal(true);
  });
  it('must have @Action annotation', function() {
    var haveHeadAnnotation = AnnotationHelper.haveHeadAnnotation(file2, headAnnotations);
    expect(haveHeadAnnotation).to.equal(true);
  });
  it('has not any known annotation', function() {
    var haveHeadAnnotation = AnnotationHelper.haveHeadAnnotation(file3, headAnnotations);
    expect(haveHeadAnnotation).to.equal(false);
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
