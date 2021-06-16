require('nodejs-require-enhancer');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
require('org/test/common/MochaAutoconfigurator.js');
var WebpackUtil = require('org/linkstartjs/webpack/util/WebpackUtil.js');

describe('org/linkstartjs/webpack/util/WebpackUtil.js: smartUniqueFileLocator', function() {
  it('one css file', function() {
    var cssFile = WebpackUtil.smartUniqueFileLocator(__dirname+'/WebpackUtilTest/folderWithOneCssFile',"index.scss");
    expect(cssFile).to.equal("/src/styles/bar/index.scss");
  });
  it('null css file', function() {
    var nullCssFile = WebpackUtil.smartUniqueFileLocator(__dirname+'/WebpackUtilTest/folderWithoutCss', 'index.scss');
    assert(!nullCssFile);
  });
});

describe('org/linkstartjs/webpack/util/WebpackUtil.js: filesToCssImporSentence', function() {
  it('several css files', function() {
    var filesToScssSentence = WebpackUtil.filesToCssImporSentence(["styles/main.scss","styles/index.scss","styles/import.scss"]);
    assert.ok(filesToScssSentence.includes(`import './styles/main.scss'`));
    assert.ok(filesToScssSentence.includes(`import './styles/index.scss'`));
    assert.ok(filesToScssSentence.includes(`import './styles/import.scss'`));
  });
});
