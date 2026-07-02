const loaderUtils = require("loader-utils");
const path = require('path');
const EntrypointModuleCreator = require('./EntrypointModuleCreator.js');
const Logger = require('../../logger/Logger.js')

Logger.info("\nLinkStart Webpack Loader is looking for entrypoint");

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};

  if(typeof options.linkstartJsLogLevel !== 'undefined'){
    global.linkstartJsLogLevel = options.linkstartJsLogLevel;
  }

  if(typeof options.metaJsLogLevel !== 'undefined'){
    global.metaJsLogLevel = options.metaJsLogLevel;
  }

  var entrypointModuleCreator = new EntrypointModuleCreator();

  if(this.resourcePath.startsWith(path.join(options.srcLocation, "main", "index.js"))){
    Logger.info("Entrypoint was found: "+this.resourcePath);
    Logger.info("Link Start!!");
    Logger.info("Link Start Webpack Loader Options:\n");
    Logger.info(options);    
    return entrypointModuleCreator.createModule(options, content);
  }else{
    Logger.debug("not entrypoint:"+this.resourcePath);
    //hide annotations
    content = entrypointModuleCreator.removeAnnotationInModule(content);
    return content;
  }
}

module.exports = loader;
