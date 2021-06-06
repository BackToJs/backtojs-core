const pathHelper = require('path')
const fs = require('fs');
const glob = require('glob');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

function WebpackUtil(){

}

/*
  linkStart raw option string is linkStart({ logLevel:'debug'})
*/
WebpackUtil.getLinkStartOptionsFromFilePath = function(entrypoint){
  try{
    var contents = fs.readFileSync(entrypoint, 'utf8');
    return WebpackUtil.getLinkStartOptionsFromFileContent(contents);
  }catch(err){
    console.log("\noptions err:");
    console.log(err);
  }
}

/*
  linkStart raw option string is linkStart({ logLevel:'debug'})
*/
WebpackUtil.getLinkStartOptionsFromFileContent = function(contents){
  try{
    const regex = /\([\s\S]*?\)/g;// match any string inside of ({....})
    var found = contents.match(regex);
    var jsonString = found[0].replace("(","").replace(")","");
    return JSON.parse(jsonString)
  }catch(err){
    console.log("\noptions err:");
    console.log(err);
  }
}

WebpackUtil.createMergeIntoSingleFilePlugin = function(options, srcLocation){

  if(typeof options === 'undefined'){
    return [];
  }

  var pluginConfig = {
      files: {}
  }

  var pluginArray = [];

  if(typeof options.loadAtHead !== 'undefined'){
    //get Files to load at head
    var filesToLoad = options.loadAtHead;
    var jsFiles = [];
    var cssFiles = [];
    filesToLoad.forEach(function(file){
      if(file.endsWith(".js")){
        jsFiles.push(srcLocation+"/"+file)
      }else if(file.endsWith(".css")){
        cssFiles.push(srcLocation+"/"+file)
      }
    })

    if(jsFiles.length > 0){
      pluginConfig.files['js/head-library.js'] = jsFiles;
    }
    if(cssFiles.length > 0){
      pluginConfig.files['css/head-style.css'] = cssFiles;
    }

    if(jsFiles.length > 0 || cssFiles.length > 0){
      var plugin = new MergeIntoSingleFilePlugin(pluginConfig)
      pluginArray.push(plugin);
    }
  }

  return pluginArray;
}


WebpackUtil.filesToCssImporSentence = function(files){
  var sentences = "";
  try{
    for(file of files){
      sentences = sentences.concat("\n").concat(`import './${file}'`)
    }
  }catch(err){
    console.log("\noptions err:");
    console.log(err);
  }
  return sentences;
}

WebpackUtil.smartUniqueFileLocator = function(srcDirectory, fileName){

  var ext = pathHelper.extname(fileName);
  try{

    var files = [];
    WebpackUtil.searchFiles(srcDirectory, files, ext);
    if(files.length === 1){
      return files[0].replace(srcDirectory,"")
    }

    var indexCssFiles = [];
    for(file of files){
      if(file.endsWith(fileName)){
        indexCssFiles.push(file);
      }
    }

    if(indexCssFiles.length === 1){
      return indexCssFiles[0].replace(srcDirectory,"")
    }

  }catch(err){
    console.log("\noptions err:");
    console.log(err);
  }
}

WebpackUtil.searchFiles = function(path, files, ext) {
  fs.readdirSync(path).forEach(function(file) {
    var absolutePath = path + '/' + file;
    if (fs.lstatSync(absolutePath).isDirectory()) {
      WebpackUtil.searchFiles(absolutePath, files, ext);
    } else {
      if (file.endsWith(ext)) {
        files.push(path + '/' + file);
      }
    }
  });
}

module.exports = WebpackUtil;
