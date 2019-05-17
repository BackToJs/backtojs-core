const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const fileUtils = require('fs')
const cheerio = require('cheerio')

var stringFunctionInitializeActionListeners = `
_this.initializeActionListeners = function() {
  @elements
}
`;

var stringAddOnClickEntry = `
let @nativeId = document.getElementById(\"@nativeId\");
@nativeId.onclick = _this.@nativeIdOnClick;
`;

var stringFunctionTemplate = `
_this.template = function() {
  return \"@stringHtml\";
}
`;

var stringRenderFunctionTemplate = `
_this.render = function() {
  let frag = document.createRange().createContextualFragment(_this.template());
  return frag;
}
`;

var debug;

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  debug = options.debug;

  //TODO: validateOptions like
  // https://github.com/webpack-contrib/file-loader/blob/master/src/index.js#L11

  //just pages
  if(!this.resourcePath.startsWith(options.pagesFolder)){
    return content;
  }

  logInfo("Lassie page analization: "+this.resourcePath);

  //get html template as string
  var rawStringTemplate = getHtmlTemplateAsString(this.resourcePath);
  var fixedHtmlTemplate = fixString(rawStringTemplate);
  var moduleName = capitalize(getParentDirectoryName(this.resourcePath));

  //add template() function
  var htmlTemplateFunction = getTemplateFunctionAsString(moduleName, fixedHtmlTemplate)
  content = addNotParametrizableTemplateFunction(content,htmlTemplateFunction);

  //add render() function
  content = addNotParametrizableTemplateFunction(content,stringRenderFunctionTemplate);

  const $=cheerio.load(rawStringTemplate);

  var actionableElements = [];
  $('button, select').each(function (index, element) {
    if($(element)){
      if($(element).attr('ls-scan')==="true"){
        actionableElements.push($(element))
      }
    }
  });

  //add initializeActionListeners() function
  content = addInitializeActionListenersFunction(content, moduleName, actionableElements);

  logDebug(content);
  return content;
}

function addInitializeActionListenersFunction(content, moduleName, actionableElements){
  //TODO: add ls-id as unique id for each element before renderization
  // this id will be used for avoid collisions when listeners are binding if native id
  // is duplicated

  //TODO: lookup object by ls-id instead native id
  var elements = "";
  actionableElements.forEach(function (htmlElement) {
    var nativeId = htmlElement.attr('id');
    if(nativeId){
      var entry = stringAddOnClickEntry.replace(/@nativeId/g,nativeId);
      elements = elements.concat("\n").concat(entry);
    }
  });

  //add elments in initializeActionListeners string

  var stringFunction = stringFunctionInitializeActionListeners
  .replace("@moduleName",moduleName)
  .replace("@elements",elements);

  logDebug(stringFunction);
  // content = content.concat("\n").concat(stringFunction);
  content = addNotParametrizableTemplateFunction(content,stringFunction);
  return content;
}

function addNotParametrizableTemplateFunction(content, stringTemplate){
  return replaceLast(content, "}", stringTemplate+"\n}");
}

function addTemplateFunction(content, stringTemplate, moduleName){
  var stringFunction = getTemplateFunctionAsString(moduleName, stringTemplate);
  return replaceLast(content, "}", stringFunction+"\n}");
}

function getParentDirectoryName(filename){
  return pathUtils.dirname(filename).split(pathUtils.sep).pop();
}

function capitalize(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getTemplateFunctionAsString(moduleName, stringTemplate){
  return stringFunctionTemplate
  .replace("@moduleName",moduleName)
  .replace("@stringHtml",stringTemplate);
}


function getHtmlTemplateAsString(moduleAbsolutePath){
  var templateAbsolutePath = moduleAbsolutePath.replace(new RegExp('js$'), "html");
  try {
    if (fileUtils.existsSync(templateAbsolutePath)) {
      var fileContents = fileUtils.readFileSync(templateAbsolutePath).toString();
      return fileContents;
    }else{
      return "";
    }
  } catch(err) {
    console.log(err);
    return "";
  }

}

function replaceLast(x, y, z){
  var a = x.split("");
  a[x.lastIndexOf(y)] = z;
  return a.join("");
}

function fixString(string){
  return string.replace(/\"/g,"\\\"").replace(/(\r\n|\n|\r)/gm, "");
}

function logInfo(string){
  console.log(string);
}

function logDebug(string){
  if(debug===true){
    console.log(string);
  }
}

module.exports = loader;
