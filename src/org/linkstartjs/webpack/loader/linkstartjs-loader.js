const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const EntrypointModuleCreator = require('./EntrypointModuleCreator.js');

var debug;

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  logLevel = options.logLevel;

  global.linkStartLoaderLogLevel = logLevel;

  console.log("LinkStart Webpack Loader is looking for entrypoint");

  if(this.resourcePath.startsWith(options.srcLocation+"/index.js")){
    console.log("entry point was found: "+this.resourcePath);
    console.log("Link Start!!!");
    var entrypointModuleCreator = new EntrypointModuleCreator();
    return entrypointModuleCreator.createModule(options, content);
  }else{
    return content;
  }
}

module.exports = loader;
