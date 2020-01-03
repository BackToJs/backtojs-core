const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const fileUtils = require('fs')

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  console.log("##########################");
  console.log(this.resourcePath);
  console.log(this.context);
  var stringTemplate = getHtmlTemplateAsString(this.resourcePath);
  stringTemplate = fixString(stringTemplate);
  var stringFunction = getTemplateFunctionAsString(capitalize(getParentDirectoryName(this.resourcePath)), stringTemplate);
  content = content + "\n" + stringFunction
  return content;
}

function getParentDirectoryName(filename){
  return pathUtils.dirname(filename).split(pathUtils.sep).pop();
}

function capitalize(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getTemplateFunctionAsString(moduleName, stringTemplate){
  var rawTemplate = "@moduleName.prototype.template = function() {"+
  "return \""+stringTemplate+"\""+
  "}";
  return rawTemplate.replace("@moduleName",moduleName);
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

function fixString(string){
  return string.replace(/\"/g,"\\\"").replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = loader;


/*

Home.prototype.template = function() {
  console.log("hello!!");
}

*/
