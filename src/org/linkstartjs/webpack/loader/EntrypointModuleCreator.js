require('nodejs-import-helper');
const fileUtils = require('fs')
var path = require("path");
const DependencyHelper = include('src/org/metajs/core/DependencyHelper.js')
const AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js')
const LinksStartWebpackLoaderCommon = require('./LinksStartWebpackLoaderCommon.js');
const cheerio = require('cheerio')

function EntrypointModuleCreator() {

  var _this = this;

  var entrypointTemplatePath = path.resolve(__filename,'..')+'/LinkstartTemplate.js';
  var entrypointTemplate = fileUtils.readFileSync(entrypointTemplatePath, 'utf8');

  var headAnnotations = ["DefaultAction"];
  var internalAnnotations = ["Autowire","DomElement","Render","ActionListener"];
  var allAnnotations = headAnnotations.concat(internalAnnotations);

  var requireTemplate = `const @dependencyClassName = require('@dependencyLocation');`;
  var instantiateModuleTemplate = `_this.context["@dependencyName"] = new @dependencyClassName();`;
  var injectionTemplate = `_this.context["@dependencyName"].@autowireName = _this.context["@autowireName"];`;
  var fragmentMappingTemplate = `_this.actionsByFragmentUrlRoute["@route"] = _this.context["@dependencyName"];`;
  var globalAttributesTemplate = `_this.defaultFragmentUrlRoute = "@route";`;

  _this.createModule = function(options, content) {

    LinksStartWebpackLoaderCommon.logDebug("srcLocation:" + options.srcLocation);
    var dependencies = DependencyHelper.getDependecies(options.srcLocation, [".js", ".html"], ["src/index.js", "src/index.html"],
    headAnnotations, internalAnnotations);

    LinksStartWebpackLoaderCommon.logDebug("\nNormalized dependencies");
    LinksStartWebpackLoaderCommon.logDebug(dependencies);

    LinksStartWebpackLoaderCommon.logDebug("\nPerform instantation...");
    var requires = "";
    var instantiates = "";
    var fragmentListeners = "";
    var defaultFragmentUrlRoute;
    for (dependency of dependencies) {
      var dependencyClassName = LinksStartWebpackLoaderCommon.capitalize(dependency.meta.arguments.name);

      if (dependency.meta.name == "Page") {
        var rawStringTemplate = LinksStartWebpackLoaderCommon.getHtmlTemplateAsString(dependency.location);
        var actionableElementEntries = "";
        var modelElementEntries = "";

        const $ = cheerio.load(rawStringTemplate);
        $('*').each(function(index, element) {
          if ($(element)) {
            if ($(element).attr('ls-model') === "true") {
              var htmlObjectId = $(element).attr('id');
              if (htmlObjectId) {
                let uniqueId = Math.floor(Math.random() * 100001);
                var entry = modelElementEntryTemplate.replace("@htmlObjectId", htmlObjectId);
                entry = entry.replace("@lsId", uniqueId);
                modelElementEntries = modelElementEntries.concat("\n").concat(entry);
                $(element).attr("ls-id", uniqueId);
              }
            } else if ($(element).attr('ls-actionable') === "true") {
              var htmlObjectId = $(element).attr('id');
              if (htmlObjectId) {
                let uniqueId = Math.floor(Math.random() * 100001);
                var entry = actionableElementEntryTemplate.replace("@htmlObjectId", htmlObjectId);
                entry = entry.replace("@lsId", uniqueId);
                actionableElementEntries = actionableElementEntries.concat("\n").concat(entry);
                $(element).attr("ls-id", uniqueId);
              }
            }
          }
        });

        var fixedHtmlTemplate = LinksStartWebpackLoaderCommon.fixString($.html());

        //instantiate
        var instantiateSentence = instantiateVariableTemplate
          .replace("@dependencyName", dependency.arguments.name)
          .replace("@templateRawValue", fixedHtmlTemplate)
          .replace("@actionableElementEntries", actionableElementEntries)
          .replace("@modelElementEntries", modelElementEntries);

        instantiates = instantiates.concat("\n").concat(instantiateSentence);
      } else if (dependency.meta.name == "DefaultAction") {
        //get require
        var requireSentence = requireTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyLocation", dependency.meta.location.replace(options.srcLocation,"."));
        requires = requires.concat("\n").concat(requireSentence);
        //instantiate
        var instantiateSentence = instantiateModuleTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyName", dependency.meta.arguments.name);
        instantiates = instantiates.concat("\n").concat(instantiateSentence);

        if (dependency.meta.arguments.route) {
          var fragmentMappingSentence = fragmentMappingTemplate
            .replace("@route", dependency.meta.arguments.route)
            .replace("@dependencyName", dependency.meta.arguments.name);
          fragmentListeners = fragmentListeners.concat("\n").concat(fragmentMappingSentence);
        }

        //lookup default entry point
        if (dependency.meta.arguments.entrypoint == "true") {
          if (dependency.meta.arguments.route) {
            defaultFragmentUrlRoute = dependency.meta.arguments.route;
          }
        }
      }else{
        console.log(dependency.meta.name+" is not a LinkStart.js annotation");
      }

    }

    // LinksStartWebpackLoaderCommon.logDebug("\nPerform injection...");
    // var injections = "";
    // for (dependency of dependencies) {
    //
    //   var variablesToInject = dependency.variablesToInject;
    //
    //   for (variableToInject of variablesToInject) {
    //     var injectionSentence = injectionTemplate
    //       .replace(new RegExp("@dependencyName", 'g'), dependency.arguments.name)
    //       .replace(new RegExp("@autowireName", 'g'), variableToInject);
    //     injections = injections.concat("\n").concat(injectionSentence);
    //   }
    //
    // }

    var defaultFragmentUrlSentence;
    if (defaultFragmentUrlRoute) {
      defaultFragmentUrlSentence = globalAttributesTemplate
      .replace("@route", defaultFragmentUrlRoute);
    } else {
      defaultFragmentUrlSentence = "console.log('There are not any @Action defined as entrypoint')";
    }

    var entrypointModule = entrypointTemplate
      .replace("@defaultFragmentUrlSentence", defaultFragmentUrlSentence)
      .replace("@require", requires)
      .replace("@instantiate", instantiates)
      // .replace("@injection", injections)
      .replace("@fragmentListeners", (fragmentListeners.length > 0 ? fragmentListeners : ""));



    //create start function
    // var readyModule = LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction(flashBootApplicationTemplate, stringStartFunction);
    // readyModule = LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction(readyModule, routeFunctionTemplate);
    // readyModule = LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction(readyModule, locationHashChangedFunctionTemplate);
    // readyModule = LinksStartWebpackLoaderCommon.addNotParametrizableTemplateFunction(readyModule, mainPageAttribute);

    // readyModule = readyModule.concat("\n").concat(linkStartFunctionTemplate);
    content = entrypointModule.concat("\n").concat(content);

    LinksStartWebpackLoaderCommon.logDebug("\nentrypoint is ready!!\n\n");
    LinksStartWebpackLoaderCommon.logDebug(content);

    return content;

  }

  _this.removeCommentModule = function(content) {
    var allAnnotationsStringRegex=AnnotationHelper.createRegexFromAnnotations(allAnnotations);
    var regex = new RegExp(allAnnotationsStringRegex, 'g');
    while((result = regex.exec(content)) !== null) {
        content = content.replace(result[0], "//"+result[0]);
    }
    return content;
  }


}


module.exports = EntrypointModuleCreator;
