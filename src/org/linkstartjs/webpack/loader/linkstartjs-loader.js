const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const EntrypointModuleCreation = require('./EntrypointModuleCreation.js');

var debug;

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  logLevel = options.logLevel;

  global.linkStartLoaderLogLevel = logLevel;

  console.log("LinkStart Webpack Loader is looking for entrypoint");

  if(this.resourcePath.startsWith(options.srcLocation+"/index.js")){
    console.log("entry point was found: "+this.resourcePath);
    console.log("Link Start!!!");
    var entrypointModuleCreation = new EntrypointModuleCreation();
    return entrypointModuleCreation.createModule(options, content);
  }else{
    return content;
  }
}

module.exports = loader;
