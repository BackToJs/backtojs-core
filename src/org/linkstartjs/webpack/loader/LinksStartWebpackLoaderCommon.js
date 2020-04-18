const fileUtils = require('fs')

function LinksStartWebpackLoaderCommon(){
}

LinksStartWebpackLoaderCommon.getHtmlTemplateAsString = function(moduleAbsolutePath){
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

LinksStartWebpackLoaderCommon.fixString = function(string){
  return string.replace(/\"/g,"\\\"").replace(/(\r\n|\n|\r)/gm, "");
}

LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction = function(content, stringTemplate){
  return LinksStartWebpackLoaderCommon.replaceLast(content, "}", stringTemplate+"\n}");
}

LinksStartWebpackLoaderCommon.replaceLast = function(x, y, z){
  var a = x.split("");
  a[x.lastIndexOf(y)] = z;
  return a.join("");
}

LinksStartWebpackLoaderCommon.logDebug = function(string){
  if(linkStartLoaderLogLevel==="debug"){
    console.log(string);
  }
}

LinksStartWebpackLoaderCommon.capitalize = function(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function isPage(fileContent){
  var matchs = fileContent.match(new RegExp('@Page\\(.+\\)', "g"));
  return (matchs && matchs.length == 1);
}

module.exports = LinksStartWebpackLoaderCommon;
