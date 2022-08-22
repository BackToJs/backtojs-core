const fileUtils = require('fs')
const path = require("path");
const DependencyHelper = require('meta-js').DependencyHelper;
const AnnotationHelper = require('meta-js').AnnotationHelper;
const LinksStartWebpackLoaderCommon = require('./LinksStartWebpackLoaderCommon.js');
const cheerio = require('cheerio')
const Logger = require('../../logger/Logger.js')
const WebpackUtil = require('../util/WebpackUtil.js');

function EntrypointModuleCreator() {

  var _this = this;

  var entrypointTemplatePath = path.resolve(__filename,'..')+'/LinkstartTemplate.js';
  var entrypointTemplate = fileUtils.readFileSync(entrypointTemplatePath, 'utf8');

  var headAnnotations = ["DefaultAction", "Page", "Module"];
  var internalAnnotations = ["Autowire","HtmlElement","Render","ActionListener","HtmlElementsAllForOne","Async"];
  var allAnnotations = headAnnotations.concat(internalAnnotations);

  var requireTemplate = `const @dependencyClassName = require('@dependencyLocation');`;
  var instantiateModuleTemplate = `_this.dependecyContext["@dependencyName"] = new @dependencyClassName();`;
  var injectionTemplate = `_this.dependecyContext["@dependencyName"].@variable = _this.dependecyContext["@variableToAutowire"];`;
  var metadataMappingTemplate = `_this.metaContext["@dependencyName"] = @metadataForAction;`;
  var fragmentMappingTemplate = `_this.actionsByFragmentUrlRoute["@route"] = _this.dependecyContext["@dependencyName"];`;
  var globalAttributesTemplate = `_this.defaultFragmentUrlRoute = "@route";`;
  var injectionNameTemplate = `_this.dependecyContext["@dependencyName"]._ls_name = "@dependencyName";`;

  var modelElementEntryTemplate = `
  domElements.push({
    "tagId":"@htmlObjectId",
    "lsId":"@lsId",
  });
  `;

  var instantiatePageTemplate = `
  _this.dependecyContext["@dependencyName"] = {
    getDomElements : function() {
      var domElements = [];
      @domElementsEntries
      return domElements;
    },
    getHtml : function() {
      return "@templateRawValue";
    }
  };
  `;

  _this.createModule = function(options, content) {

    var linksStartCustomOptions = WebpackUtil.getLinkStartOptionsFromFileContent(content);

    Logger.debug("srcLocation:" + options.srcLocation);
    var dependencies = DependencyHelper.getDependecies(options.srcLocation, [".js", ".html"], ["src/index.js", "src/index.html"],
    headAnnotations, internalAnnotations);

    Logger.debug("Dependencies found:");
    Logger.debug(dependencies);

    Logger.debug("Perform instantation...");
    var requires = "";
    var instantiates = "";
    var fragmentListeners = "";
    var metadataByDependency = "";
    var defaultFragmentUrlRoute;
    for (dependency of dependencies) {

      if (dependency.meta.name == "Page") {
        var rawStringTemplate = LinksStartWebpackLoaderCommon.getHtmlTemplateAsString(path.join(options.srcLocation, dependency.meta.location));
        rawStringTemplate = _this.removeAnnotationInPage(rawStringTemplate);
        Logger.debug("initial page:"+rawStringTemplate)
        var domElementsEntries = "";

        const $ = cheerio.load(rawStringTemplate);
        $('*').each(function(index, element) {
          if ($(element)) {
            if ($(element).attr('ls-element') === "true") {
              var htmlObjectId = $(element).attr('id');
              if (htmlObjectId) {
                let uniqueId = Math.floor(Math.random() * 100001);
                var entry = modelElementEntryTemplate.replace("@htmlObjectId", htmlObjectId);
                entry = entry.replace("@lsId", uniqueId);
                domElementsEntries = domElementsEntries.concat("\n").concat(entry);
                $(element).attr("ls-id", uniqueId);
              }
            }
          }
        });

        var fixedHtmlTemplate = LinksStartWebpackLoaderCommon.fixString($.html());
        var fixedHtmlTemplate = LinksStartWebpackLoaderCommon.removeCheerioBody(fixedHtmlTemplate);
        Logger.debug(fixedHtmlTemplate)

        //instantiate
        var instantiateSentence = instantiatePageTemplate
          .replace("@dependencyName", dependency.meta.arguments.name)
          .replace("@templateRawValue", fixedHtmlTemplate)
          .replace("@domElementsEntries", domElementsEntries);

        instantiates = instantiates.concat("\n").concat(instantiateSentence);

      } else if (dependency.meta.name == "DefaultAction") {

        var dependencyClassName = LinksStartWebpackLoaderCommon.capitalize(dependency.meta.arguments.name);
        //get require
        var requireSentence = requireTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyLocation", "."+dependency.meta.location);
        requires = requires.concat("\n").concat(requireSentence);
        //instantiate
        var instantiateSentence = instantiateModuleTemplate
          .replace("@dependencyClassName", dependencyClassName)
          .replace("@dependencyName", dependency.meta.arguments.name);
        instantiates = instantiates.concat("\n").concat(instantiateSentence);

        //set metadata by dependency name
        var metadata = {};
        metadata.variables = dependency.variables;
        metadata.functions = dependency.functions;
        metadata.meta = dependency.meta;

        metadataMappingSentence = metadataMappingTemplate
        .replace("@metadataForAction", JSON.stringify(metadata))
        .replace("@dependencyName", dependency.meta.arguments.name);
        metadataByDependency = metadataByDependency.concat("\n").concat(metadataMappingSentence);

        //set actions by fragment url
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
      }else if (dependency.meta.name == "Module") {
				var dependencyClassName = LinksStartWebpackLoaderCommon.capitalize(dependency.meta.arguments.name);
				//get require
				var requireSentence = requireTemplate
					.replace("@dependencyClassName", dependencyClassName)
					.replace("@dependencyLocation", dependency.meta.location);
				requires = requires.concat("\n").concat(requireSentence);
				//instantiate
				var instantiateSentence = instantiateModuleTemplate
					.replace("@dependencyClassName", dependencyClassName)
					.replace("@dependencyName", dependency.meta.arguments.name);
				instantiates = instantiates.concat("\n").concat(instantiateSentence);
			}else{
        Logger.debug(dependency.meta.name+" is not a LinkStart.js annotation");
      }
    }

    Logger.info("Success instantation");
    Logger.debug("Perform injection...");
    var injections = "";
    for (dependency of dependencies) {

      Logger.debug(dependency);
      var dependencyName = dependency.meta.arguments.name;
      Logger.debug(`dependencyName: ${dependencyName}`);
      for (var variableName in dependency.variables) {
        Logger.debug(variableName);
        var annotations = dependency.variables[variableName];
        Logger.debug(annotations);
        for (var index in annotations) {
          var annotation = annotations[index];

          if(typeof annotation.name === 'undefined'){
            continue;
          }

          Logger.debug(annotation.name);
          if(annotation.name === 'Autowire'){
            if(typeof annotation.arguments.name === 'undefined'){
              Logger.debug(`variable: ${variableName} has a wrong @Autowire. name is required in Autowire annotation`);
              continue;
            }

            Logger.debug("ready to inject:"+annotation.arguments.name);
            var injectionSentence;
            if(annotation.arguments.name==="linksStartContext"){
              injectionSentence = `_this.dependecyContext["@dependencyName"].@variable = _this.linksStartContext;`
                .replace(new RegExp("@dependencyName", 'g'), dependencyName)
                .replace(new RegExp("@variableToAutowire", 'g'), annotation.arguments.name)
                .replace(new RegExp("@variable", 'g'), variableName);
            }else{
              injectionSentence = injectionTemplate
              .replace(new RegExp("@dependencyName", 'g'), dependencyName)
              .replace(new RegExp("@variableToAutowire", 'g'), annotation.arguments.name)
              .replace(new RegExp("@variable", 'g'), variableName);
            }

            injections = injections.concat("\n").concat(injectionSentence);
          }
        }
      }

      var injectionName = injectionNameTemplate.replace(new RegExp("@dependencyName", 'g'),dependencyName);
      injections = injections.concat("\n").concat(injectionName);
    }

    Logger.info("Success dependency injection");

    var defaultFragmentUrlSentence;
    if (defaultFragmentUrlRoute) {
      defaultFragmentUrlSentence = globalAttributesTemplate
      .replace("@route", defaultFragmentUrlRoute);
    } else {
      defaultFragmentUrlSentence = "Logger.debug('There are not any @Action defined as entrypoint')";
    }

    //import './styles/index.scss'
    var importCssSentence;
    Logger.debug("EntrypointModuleCreator options:"+JSON.stringify(linksStartCustomOptions));
    if(typeof linksStartCustomOptions.importCssFiles === 'undefined' || linksStartCustomOptions.importCssFiles.length === 0){
      var scssFile = WebpackUtil.smartUniqueFileLocator(options.srcLocation, 'index.scss');
      if(scssFile){
        scssFile = "."+scssFile
        importCssSentence = `import '${scssFile}'`;
      }else{
        importCssSentence = "";
      }
    }else{
      importCssSentence = WebpackUtil.filesToCssImporSentence(linksStartCustomOptions.importCssFiles);
    }

    Logger.info("Style found: "+importCssSentence);

    var entrypointModule = entrypointTemplate
      .replace("@importCssFilesSentence", importCssSentence)
      .replace("@defaultFragmentUrlSentence", defaultFragmentUrlSentence)
      .replace("@require", requires)
      .replace("@instantiate", instantiates)
      .replace("@injection", injections)
      .replace("@metadataByDependency", metadataByDependency)
      .replace("@fragmentListeners", (fragmentListeners.length > 0 ? fragmentListeners : ""));


    content = entrypointModule.concat("\n").concat(content);

    Logger.debug("\nentrypoint is ready!!\n\n");
    Logger.debug(content);
    Logger.debug("Cardinal system is ready");
    return content;

  }

  _this.removeAnnotationInModule = function(content) {
    var allAnnotationsStringRegex=AnnotationHelper.createRegexFromAnnotations(allAnnotations);
    var regex = new RegExp(allAnnotationsStringRegex, 'g');
    while((result = regex.exec(content)) !== null) {
        content = content.replace(result[0], "//"+result[0]);
    }
    return content;
  }

  _this.removeAnnotationInPage = function(content) {
    var allAnnotationsStringRegex=AnnotationHelper.createRegexFromAnnotations(allAnnotations);
    var regex = new RegExp(allAnnotationsStringRegex, 'g');
    while((result = regex.exec(content)) !== null) {
        content = content.replace(result[0], "");
    }
    return content;
  }


}


module.exports = EntrypointModuleCreator;
