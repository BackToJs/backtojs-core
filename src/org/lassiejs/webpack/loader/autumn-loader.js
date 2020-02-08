const loaderUtils = require("loader-utils");
const pathUtils = require('path');
const fileUtils = require('fs')
const DependencyInjection = require('../../../../org/autumnframework/context/DependencyInjection.js')

var requireTemplate = `const @dependencyClassName = require('@dependencyLocation');`;

var instantiateTemplate = `_this.context["@dependencyName"] = new @dependencyClassName();`;

var injectionTemplate = `_this.context.@dependencyName.@autowireName = this.context.@autowireName;`;

var startFunctionTemplate = `
_this.start = function () {
  @require
  @instantiate
  @injection
  _this.route(_this.mainPage);
};
`;

//TODO: how initialize onclick before dom insertion
var routeFunctionTemplate = `
_this.route = function (pageName) {
  var page = _this.context[pageName];
  var element = page.render();
  document.getElementById("root").innerHTML = '';
  document.getElementById("root").appendChild(element);
  page.initializeActionListeners();
};
`;

var locationHashChangedFunctionTemplate = `
function locationHashChanged() {
  console.log(location.hash);
  //lookup in context
  var pageName = location.hash.replace("#","");
  if(!_this.context[pageName]){
    console.log("There are not any page with name: "+pageName);
    return;
  }
  _this.route(pageName);
}
window.onhashchange = locationHashChanged;
`;

var mainPageAttributeTemplate = `
_this.mainPage = "@dependencyName";
`;

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
  var requires = "";
  var instantiates = "";
  var mainPage;
  for(dependency of dependencies){
    var dependencyClassName = capitalize(dependency.arguments.name);

    //get require
    var requireSentence = requireTemplate
    .replace("@dependencyClassName",dependencyClassName)
    .replace("@dependencyLocation",dependency.location);
    // logDebug(requireSentence);
    requires = requires.concat("\n").concat(requireSentence);
    //instantiate
    var instantiateSentence = instantiateTemplate
    .replace("@dependencyClassName",dependencyClassName)
    .replace("@dependencyName",dependency.arguments.name);
    // logDebug(instantiateSentence);
    instantiates = instantiates.concat("\n").concat(instantiateSentence);

    //lookup main page
    if(dependency.arguments.mainPage == "true"){
      mainPage = dependency.arguments.name;
    }
  }

  logDebug("\nPerform injection...");
  var injections = "";
  for(dependency of dependencies){

    var variablesToInject = dependency.variablesToInject;

    for(variableToInject of variablesToInject){
      var injectionSentence = injectionTemplate
      .replace(new RegExp("@dependencyName", 'g'),dependency.arguments.name)
      .replace(new RegExp("@autowireName", 'g'),variableToInject);
      injections = injections.concat("\n").concat(injectionSentence);
    }

  }

  var stringStartFunction = startFunctionTemplate
  .replace("@require",requires)
  .replace("@instantiate",instantiates)
  .replace("@injection",injections);

  content = addNotParametrizableTemplateFunction(content,stringStartFunction);
  content = addNotParametrizableTemplateFunction(content,routeFunctionTemplate);
  content = addNotParametrizableTemplateFunction(content,locationHashChangedFunctionTemplate);


  if(mainPage){
    var mainPageAttribute = mainPageAttributeTemplate
    .replace("@dependencyName",mainPage);
    content = addNotParametrizableTemplateFunction(content,mainPageAttribute);
  }else {
    content = addNotParametrizableTemplateFunction(content,"console.log('There are not any @PageListener defined as mainPage');");
  }

  logDebug(content);
  return content;
}

function addNotParametrizableTemplateFunction(content, stringTemplate){
  return replaceLast(content, "}", stringTemplate+"\n}");
}

function replaceLast(x, y, z){
  var a = x.split("");
  a[x.lastIndexOf(y)] = z;
  return a.join("");
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
