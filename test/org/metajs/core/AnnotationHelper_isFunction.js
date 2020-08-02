require('nodejs-import-helper');
var chai = require('chai');
var expect = chai.expect;
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');

describe('AnnotationHelper: isFunction', function() {
  it('is a simple arrow function without arguments', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = () => {");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function without arguments and several spaces', function() {
    var isFunction = AnnotationHelper.isFunction("  const displayQuote =  ()  =>   {  ");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function with one argument', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = (a) => {");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function with one argument and spaces', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = ( aaa ) => {");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function with two arguments', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = (aaa,bbb) => {");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function with three arguments', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = (aaa,bbb,cccc) => {");
    expect(isFunction).to.equal(true);
  });
  it('is a simple arrow function with three arguments and spaces', function() {
    var isFunction = AnnotationHelper.isFunction("const displayQuote = ( aaa ,bbb , ccccc ) => {");
    expect(isFunction).to.equal(true);
  });
});
