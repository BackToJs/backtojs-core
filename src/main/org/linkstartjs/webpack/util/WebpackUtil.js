const fs = require('fs');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

function WebpackUtil(){

}

/*
  linkStart raw option string is linkStart({ logLevel:'debug'})
*/
WebpackUtil.getLinkStartOptions = function(entrypoint){
  try{
    var contents = fs.readFileSync(entrypoint, 'utf8');
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

module.exports = WebpackUtil;
