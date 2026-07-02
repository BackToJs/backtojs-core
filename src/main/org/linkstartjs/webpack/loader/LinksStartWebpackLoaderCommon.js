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

LinksStartWebpackLoaderCommon.removeCheerioBody = function(string){
  return string.replace("<html><head></head><body>","").replace("</body></html>","");
}

LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction = function(content, stringTemplate){
  return LinksStartWebpackLoaderCommon.replaceLast(content, "}", stringTemplate+"\n}");
}

LinksStartWebpackLoaderCommon.replaceLast = function(x, y, z){
  var a = x.split("");
  a[x.lastIndexOf(y)] = z;
  return a.join("");
}

LinksStartWebpackLoaderCommon.capitalize = function(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

LinksStartWebpackLoaderCommon.replaceAll = function(str, find, replace){
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = LinksStartWebpackLoaderCommon;
