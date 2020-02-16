const fileUtils = require('fs')

function LassieLoaderCommon(){
}

LassieLoaderCommon.getHtmlTemplateAsString = function(moduleAbsolutePath){
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

LassieLoaderCommon.fixString = function(string){
  return string.replace(/\"/g,"\\\"").replace(/(\r\n|\n|\r)/gm, "");
}

LassieLoaderCommon.addNotParametrizableTemplateFunction = function(content, stringTemplate){
  return LassieLoaderCommon.replaceLast(content, "}", stringTemplate+"\n}");
}

LassieLoaderCommon.replaceLast = function(x, y, z){
  var a = x.split("");
  a[x.lastIndexOf(y)] = z;
  return a.join("");
}

LassieLoaderCommon.logDebug = function(string){
  if(lassieLoaderLogLevel==="debug"){
    console.log(string);
  }
}

LassieLoaderCommon.capitalize = function(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}


module.exports = LassieLoaderCommon;
