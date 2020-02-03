const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const fileUtils = require('fs')
const DependencyInjection = require('../../../../org/autumnframework/context/DependencyInjection.js')

var requireTemplate = `const @dependencyClassName = require('@dependencyLocation');`;

var instantiateTemplate = `_this.context.@dependencyName = new @dependencyClassName();`;

var injectionTemplate = `_this.context.@dependencyName.@autowireName = this.context.@autowireName;`;

var debug;

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  debug = options.debug;

  if(!this.resourcePath.startsWith(options.applicationContextLocation)){
      return content;
  }

  logDebug("applicationContextLocation:"+options.applicationContextLocation);
  logDebug("folderToScan:"+options.folderToScan);
  var dependencies = DependencyInjection.getDependecies(options.folderToScan);

  logDebug("dependencies");
  logDebug(dependencies);

  var instancedDependecies = {};

  logDebug("\nPerform instantation...");
  for(dependency of dependencies){
    logDebug("Detected dependency:"+dependency.name);
    logDebug("Detected dependency:"+dependency.location);

    var dependencyClassName = capitalize(dependency.name);

    //get require
    var requireSentence = requireTemplate
    .replace("@dependencyClassName",dependencyClassName)
    .replace("@dependencyLocation",dependency.location);
    logDebug(requireSentence);
    //instantiate
    var instantiateSentence = instantiateTemplate
    .replace("@dependencyClassName",dependencyClassName)
    .replace("@dependencyName",dependency.name);
    logDebug(instantiateSentence);
  }

  logDebug("\nPerform injection...");
  for(dependency of dependencies){
    logDebug("Detected dependency:"+dependency.name);
    logDebug("variablesToInject:"+dependency.variablesToInject);

    var variablesToInject = dependency.variablesToInject;

    for(variableToInject of variablesToInject){
      var injectionSentence = injectionTemplate
      .replace(new RegExp("@dependencyName", 'g'),dependency.name)
      .replace(new RegExp("@autowireName", 'g'),variableToInject);
      logDebug(injectionSentence);
    }

  }

  return content;
}

function logInfo(string){
  console.log(string);
}

function logDebug(string){
  if(debug===true){
    console.log(string);
  }
}

function capitalize(word){
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = loader;
