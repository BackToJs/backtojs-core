require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

var test1_fileContent =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire
  var liveExample;

  function dummy(){};`;

var test2_fileContent =
`function ClickCounterAction() {
  var $ = this;

  //@Autowire
  var liveExample;

  //@Autowire
  var liveExample2;

  function dummy(){};`;


describe('Get line number of annotations ', function() {
  it('#1 single anottation', function() {
    var matchs = AnnotationHelper.getLineNumbersOfRegexInContent("@Autowire",test1_fileContent);
    expect(matchs.length).to.equal(1);
  });
  it('#2 two anottations', function() {
    var matchs = AnnotationHelper.getLineNumbersOfRegexInContent("@Autowire",test2_fileContent);
    expect(matchs.length).to.equal(2);
  });
  it('#3 exact number for 1 annotation', function() {
    var matchs = AnnotationHelper.getLineNumbersOfRegexInContent("@Autowire",test1_fileContent);
    expect(matchs[0].number).to.equal(4);
  });
  it('#4 exact number for 2 annotations', function() {
    var matchs = AnnotationHelper.getLineNumbersOfRegexInContent("@Autowire",test2_fileContent);
    expect(matchs[0].number).to.equal(4);
    expect(matchs[1].number).to.equal(7);
  });
});
