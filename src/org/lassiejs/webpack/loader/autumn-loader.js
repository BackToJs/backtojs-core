const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const AutoConfigurationModuleCompletion = require('./AutoConfigurationModuleCompletion.js');
const TemplateModuleCompletion = require('./TemplateModuleCompletion.js');

var debug;

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  logLevel = options.logLevel;

  global.lassieLoaderLogLevel = logLevel;

  console.log("Lassie page analization: "+this.resourcePath);

  if(this.resourcePath.startsWith(options.srcLocation+"/index.js")){
    var autoConfigurationModuleCompletion = new AutoConfigurationModuleCompletion();
    return autoConfigurationModuleCompletion.createModule(options, content);
  }else if(isTemplate(content)){
    console.log("template detected");
    // var templateModuleCreator = new TemplateModuleCreator();
    // return templateModuleCreator.create(options);
    return content;
  }else{
    return content;
  }
}

function isTemplate(fileContent){
  var matchs = fileContent.match(new RegExp('@Template\\(.+\\)', "g"));
  return (matchs && matchs.length == 1);
}


module.exports = loader;
