const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const EntrypointModuleCreator = require('./EntrypointModuleCreator.js');
const Logger = include('src/org/linkstartjs/logger/Logger.js')

Logger.info("LinkStart Webpack Loader is looking for entrypoint");

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};

  if(typeof linkstartJsLogLevel !== 'undefined'){
    global.linkstartJsLogLevel = linkstartJsLogLevel;
  }

  if(typeof metaJsLogLevel !== 'undefined'){
    global.metaJsLogLevel = metaJsLogLevel;
  }

  var entrypointModuleCreator = new EntrypointModuleCreator();

  if(this.resourcePath.startsWith(options.srcLocation+"/index.js")){
    Logger.info("entrypoint soul was found: "+this.resourcePath);
    Logger.info("Link Start!!!\n\n");
    return entrypointModuleCreator.createModule(options, content);
  }else{
    Logger.debug("not entrypoint:"+this.resourcePath);
    //hide annotations
    content = entrypointModuleCreator.removeAnnotationInModule(content);
    return content;
  }
}

module.exports = loader;
