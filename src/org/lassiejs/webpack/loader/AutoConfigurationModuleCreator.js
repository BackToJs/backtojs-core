const fileUtils = require('fs')
const DependencyInjection = require('../../../../org/autumnframework/context/DependencyInjection.js')
const LassieLoaderCommon = require('./LassieLoaderCommon.js');

function AutoConfigurationModuleCreator() {

  var _this = this;

  var requireTemplate = `const @dependencyClassName = require('@dependencyLocation');`;
  var instantiateModuleTemplate = `_this.context["@dependencyName"] = new @dependencyClassName();`;
  var instantiateVariableTemplate = `_this.context["@dependencyName"] =  @variableValue;`;
  var injectionTemplate = `_this.context["@dependencyName"].@autowireName = _this.context["@autowireName"];`;
  var fragmentMappingTemplate = `_this.listenersByFragmentUrlId["@fragmentUrlId"] = _this.context["@dependencyName"];`;

  var startFunctionTemplate = `
  _this.start = function () {
    @require
    @instantiate
    @injection
    @fragmentListeners

    if(_this.entrypointFragmentUrlId && _this.listenersByFragmentUrlId[_this.entrypointFragmentUrlId]){
      console.log("default:"+_this.entrypointFragmentUrlId);
      _this.route(_this.entrypointFragmentUrlId);
    }else{
      console.log('There are not any @PageListener defined as entrypoint');
    }
  };
  `;

  //TODO: how initialize onclick before dom insertion
  var routeFunctionTemplate = `
  _this.route = function (fragmentUrlId) {
    var pageListener = _this.listenersByFragmentUrlId[fragmentUrlId];
    var element = pageListener.render();
    document.getElementById("root").innerHTML = '';
    document.getElementById("root").appendChild(element);
    // page.initializeActionListeners();
  };
  `;

  var locationHashChangedFunctionTemplate = `
  function locationHashChanged() {
    console.log(location.hash);
    var pageName = location.hash.replace("#","");
    if(!_this.context[pageName]){
      console.log("There are not any page with name: "+pageName);
      return;
    }
    _this.route(pageName);
  }
  window.onhashchange = locationHashChanged;
  `;

  var globalAttributesTemplate = `
  _this.entrypointFragmentUrlId = "@fragmentUrlId";
  `;

  _this.createModule = function(options, content) {

    LassieLoaderCommon.logDebug("autoConfigurationLocation:" + options.autoConfigurationLocation);
    LassieLoaderCommon.logDebug("folderToScan:" + options.folderToScan);
    var dependencies = DependencyInjection.getDependecies(options.folderToScan, [".js", ".html"]);

    LassieLoaderCommon.logDebug("dependencies");
    LassieLoaderCommon.logDebug(dependencies);

    LassieLoaderCommon.logDebug("\nPerform instantation...");
    var requires = "";
    var instantiates = "";
    var fragmentListeners = "";
    var entrypointFragmentUrlId;
    for (dependency of dependencies) {
      var dependencyClassName = LassieLoaderCommon.capitalize(dependency.arguments.name);

      if (dependency.type == "Template") {
        var rawStringTemplate = LassieLoaderCommon.getHtmlTemplateAsString(dependency.location);
        var fixedHtmlTemplate = LassieLoaderCommon.fixString(rawStringTemplate);

        //instantiate
        var instantiateSentence = instantiateVariableTemplate
          .replace("@dependencyName", dependency.arguments.name)
          .replace("@variableValue", "\"" + fixedHtmlTemplate + "\"");

        instantiates = instantiates.concat("\n").concat(instantiateSentence);
      } else {
        //get require
        var requireSentence = requireTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyLocation", dependency.location);
        // LassieLoaderCommon.logDebug(requireSentence);
        requires = requires.concat("\n").concat(requireSentence);
        //instantiate
        var instantiateSentence = instantiateModuleTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyName", dependency.arguments.name);
        // LassieLoaderCommon.logDebug(instantiateSentence);
        instantiates = instantiates.concat("\n").concat(instantiateSentence);

        if (dependency.arguments.fragmentUrlId) {
          var fragmentMappingSentence = fragmentMappingTemplate
            .replace("@fragmentUrlId", dependency.arguments.fragmentUrlId)
            .replace("@dependencyName", dependency.arguments.name);
          // LassieLoaderCommon.logDebug(fragmentListeners);
          fragmentListeners = fragmentListeners.concat("\n").concat(fragmentMappingSentence);
        }
      }

      //custom configurations

      //lookup default entry point
      if (dependency.arguments.entrypoint == "true") {
        if (dependency.arguments.fragmentUrlId) {
          entrypointFragmentUrlId = dependency.arguments.fragmentUrlId;
        }
      }
    }

    LassieLoaderCommon.logDebug("\nPerform injection...");
    var injections = "";
    for (dependency of dependencies) {

      var variablesToInject = dependency.variablesToInject;

      for (variableToInject of variablesToInject) {
        var injectionSentence = injectionTemplate
          .replace(new RegExp("@dependencyName", 'g'), dependency.arguments.name)
          .replace(new RegExp("@autowireName", 'g'), variableToInject);
        injections = injections.concat("\n").concat(injectionSentence);
      }

    }

    var stringStartFunction = startFunctionTemplate
      .replace("@require", requires)
      .replace("@instantiate", instantiates)
      .replace("@injection", injections)
      .replace("@fragmentListeners", (fragmentListeners.length > 0 ? fragmentListeners : ""));

    content = LassieLoaderCommon.addNotParametrizableTemplateFunction(content, stringStartFunction);
    content = LassieLoaderCommon.addNotParametrizableTemplateFunction(content, routeFunctionTemplate);
    content = LassieLoaderCommon.addNotParametrizableTemplateFunction(content, locationHashChangedFunctionTemplate);


    if (entrypointFragmentUrlId) {
      var mainPageAttribute = globalAttributesTemplate
        .replace("@fragmentUrlId", entrypointFragmentUrlId);
      content = LassieLoaderCommon.addNotParametrizableTemplateFunction(content, mainPageAttribute);
    } else {
      content = LassieLoaderCommon.addNotParametrizableTemplateFunction(content, "console.log('There are not any @PageListener defined as entrypoint');");
    }

    LassieLoaderCommon.logDebug(content);

    return content;

  }
}


module.exports = AutoConfigurationModuleCreator;
