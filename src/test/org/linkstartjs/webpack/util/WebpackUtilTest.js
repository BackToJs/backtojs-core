require('nodejs-require-enhancer');
const Assert = require('assert-js')
var WebpackUtil = require('org/linkstartjs/webpack/util/WebpackUtil.js');

var cssFile = WebpackUtil.smartUniqueFileLocator(__dirname+'/WebpackUtilTest/folderWithOneCssFile',"index.scss");
Assert.string(cssFile, "WebpackUtil.smartCssLocator should find exactly one css file");
Assert.equal(cssFile,"/src/styles/bar/index.scss", `Expected /src/styles/bar/index.scss but got ${cssFile}`);

var nullCssFile = WebpackUtil.smartUniqueFileLocator(__dirname+'/WebpackUtilTest/folderWithoutCss', 'index.scss');
Assert.true(nullCssFile == null, `Expected null variable but was ${nullCssFile}`);

var filesToScssSentence = WebpackUtil.filesToCssImporSentence(["styles/main.scss","styles/index.scss","styles/import.scss"]);
Assert.true(filesToScssSentence.includes(`import './styles/main.scss'`), `result string should contain import './styles/main.scss`);
Assert.true(filesToScssSentence.includes(`import './styles/index.scss'`), `result string should contain import './styles/index.scss`);
Assert.true(filesToScssSentence.includes(`import './styles/import.scss'`), `result string should contain import './styles/import.scss`);
