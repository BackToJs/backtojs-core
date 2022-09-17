const axios = require("axios");
import ejs from "ejs/ejs.min.js";
@importCssFilesSentence
@importTemplateEngineSentence

function Logger(){}

var originalConsoleLog = console.log
Logger.debug = function(message){
  if(typeof LinkStartOptions !== 'undefined' && typeof LinkStartOptions.logLevel !== 'undefined' && LinkStartOptions.logLevel==="debug"){
    // console.log(message);
    // console.log.call(this, message)
    // return Function.prototype.bind.call(console.log, console, message);
    // var args = Array.prototype.slice.call(arguments);
    // args.unshift(console);
    // return Function.prototype.bind.apply(console.log, args);
    // originalConsoleLog.call(console, message);
    console.log(message);
  }
}

Logger.info = function(message){
  // return Function.prototype.bind.call(console.log, console, message);
  // originalConsoleLog.call(console, message);
  console.log(message);
}

Logger.error = function(message){
  // return Function.prototype.bind.call(console.log, console, message);
  // originalConsoleLog.call(console, message);
  console.error(message);
}

function LinkStartRoute(){}

//@Deprecated
LinkStartRoute.goTo = function(hashFragmentRoute){
  // window.location.href = "#"
  window.location.href = `#${hashFragmentRoute}`
}

global.LinkStartRoute = LinkStartRoute;

function LinkStartApplication() {

  var _this = this;
  _this.dependecyContext = {};
  _this.metaContext = {};
  _this.actionsByFragmentUrlRoute = {};

  _this.linksStartContext = {
    getMetaContext : function() {
      return _this.metaContext;
    },
    getDependecyContext : function() {
      return _this.dependecyContext;
    },
  };


  _this.registerDependenciesInContext = function() {
    @require
    @instantiate
  }

  _this.performInjection = function() {
    @injection
  }

  _this.registerDependenciesByUrlFragment = function() {
    @fragmentListeners
  }

  _this.registerMetadataByDependency = function() {
    @metadataByDependency
  }


  _this.addSpecialDependencies = async function() {
    //add spa settings  
    var resp = await axios.get('./settings.json');
    Logger.debug("loading settings")
    Logger.debug(resp.data)
    _this.dependecyContext["settings"] = resp.data


    //add loggedinUserDetails
    _this.dependecyContext["securityContext"] = {loggedinUserDetails:{}}
  }


  _this.start = async function(options) {

    global.LinkStartOptions = options;

    _this.registerDependenciesInContext();
    await _this.addSpecialDependencies();
    _this.performInjection();
    _this.registerMetadataByDependency();
    _this.registerDependenciesByUrlFragment();

    var fragment = location.hash.replace("#", "");

    if(typeof fragment !== 'undefined' && fragment.length > 0){
      _this.invokeActionByFragmentUrl(fragment);
    }else{
      //fragment is empty or null, it means localhost:8080 or acme.com
      //search a RouteHandler or EventHandler with entrypoint
      if (_this.entrypointDependencyName && _this.dependecyContext[_this.entrypointDependencyName]) {
        Logger.info("entrypoint detected: " + _this.entrypointDependencyName);
        _this.invokeHandler(_this.dependecyContext[_this.entrypointDependencyName]);
      } else {
        Logger.debug('There are not any @RouteHandler nor @EventHandler defined as entrypoint');
      }      
    }
  };

  _this.invokeActionByFragmentUrl = function(route) {
    Logger.debug(`triggering RouteHandler by route: ${route}`);
    var handler = _this.actionsByFragmentUrlRoute[route];
    
    if (typeof handler === 'undefined') {
      Logger.debug(`route ${route} has a wrong or undefined RouteHandler`);
      return;
    }

    Logger.debug(`@RouteHandler executing: ${handler._ls_name}`);

    _this.invokeHandler(handler);
  }

  _this.invokeHandler = function(handler, inboundParams) {

    Logger.debug(`@EventHandler executing: ${handler._ls_name}`);

    if (typeof handler.onLoad !== "undefined" && typeof handler.onLoad === "function") {

      //const onLoadPromise = new Promise(handler.onLoad);
      //TODO: keep a simple js onload instead a promise
      //  this.onLoad = (resolve, reject, inboundParams) => {
      //    resolve();
      //  };

      handler.onLoad(inboundParams).then((onloadResolveValue)=>{
        
        if (typeof handler.render !== "undefined" && typeof handler.render === "function") {
           _this.performRender(handler);
           // var pageName = _this.metaContext[action._ls_name].meta.arguments.page;
           // start auto bindings 
           _this.performBinding(handler);

          if (typeof handler.postRender !== "undefined" && typeof handler.postRender === "function") {
            handler.postRender();
          }

        } else {
          Logger.debug("RouteHandler does not have render() method");
        }
      });

    } else {
      Logger.debug("RouteHandler does not have onLoad() method");
    }
  

    /*if (typeof action.onLoad !== "undefined" && typeof action.onLoad === "function") {
      var isLoadAsync = _this.isFunctionAnnotatedWith(_this.metaContext[action._ls_name], "onLoad", "Async");
      if(isLoadAsync){//onLoad is async
        Logger.debug("onLoad is Async");
        action.onLoad(function(){
          _this.performRender(action);
        });
      }else{
        Logger.debug("onLoad is not Async");
        action.onLoad();
        var pageName = _this.performRender(action);
        _this.performBinding(action, pageName);
      }
    } else {
      Logger.debug("Action does not have onLoad() method");
      var pageName = _this.performRender(action);
      _this.performBinding(action, pageName);
      if (typeof action.postBinding !== "undefined" && typeof action.postBinding === "function"){
        action.postBinding();
      }
    }*/

  };

  _this.performRender = (action) =>{

      Logger.debug("render() was found");
      // throw new Error("Render function execution is not supported yet");
      var htmlAsString = action.render();
      
      //bind action variables into html using ejs
      var variablesToBindingInfo = 
        _this.searchVariablesByAnnotationName(_this.metaContext[action._ls_name].variables, action._ls_name, "Binding");
      //create ejs variables
      var variablesToBinding = {}
      for(let varToBindingInfo of variablesToBindingInfo){
        variablesToBinding[varToBindingInfo.name] = action[varToBindingInfo.name];
      }

      Logger.debug(variablesToBinding);
      
      let htmlParsedString = ejs.render(htmlAsString, variablesToBinding);
      var htmlToRender = document.createRange().createContextualFragment(htmlParsedString);

      //get the dom element id to be renderized in:
      var annotationArguments = _this.getAnnotationArgumentsOfUniqueFunctionAnnotated(action, "Render");
      var idToBeRenderized;
      if(typeof annotationArguments === 'undefined' || typeof annotationArguments.id === 'undefined'){
        idToBeRenderized = "root";
      }else{
        idToBeRenderized = annotationArguments.id;
      }

      Logger.debug("handler will render content in an element with id: "+idToBeRenderized)
      document.getElementById(idToBeRenderized).innerHTML = '';
      document.getElementById(idToBeRenderized).appendChild(htmlToRender);
      //html dom is ready
      //bind dom onclick events to action methods

  }

  _this.performBinding = function(action) {
    //html dom is ready
    Logger.debug(`performing bindings`);
    //bind dom onclick events to action methods
    _this.applyActionListenersAutoBinding(_this.metaContext[action._ls_name].functions, action);

    //bind dom variables to action variables
    //_this.applyDomElemensAutoBinding(action, _this.dependecyContext[pageName], _this.metaContext[action._ls_name].variables);

    //allForOne
    // _this.bindDomElementAllForOne(action, variableToUseAsRender, _this.metaContext[action._ls_name].variables);
  }

  _this.locationHashChanged = function() {    
    Logger.debug(`new hash fragment in url: ${location.hash}`);
    var fragment = location.hash.replace("#", "");
    if (!_this.actionsByFragmentUrlRoute[fragment]) {
      //@TODO: what to do when route is not found: Show a message or nothing?
      let messageToLog = "There are not any @RouteHandler asociated to this route: " + fragment;
      Logger.debug(messageToLog);
      document.getElementById("root").innerHTML = '';
      document.getElementById("root").appendChild(document.createRange().createContextualFragment(messageToLog));
      return;
    }
    _this.invokeActionByFragmentUrl(fragment);
  }

  _this.searchOneVariableByAnnotationName = function(variables, actionName, annotationName) {
    var renderCount = 0;
    var renderVariable;
    for (var i in variables) {
      for (var a in variables[i]) {
        var annotation = variables[i][a];
        if (annotation.name == annotationName) {
          renderCount++;
          renderVariable = {
            name:i,
            meta:variables[i][a]
          }
        }
      }
    }

    if (renderCount == 0) {
      Logger.debug(actionName + " action does not have any @Render annotation");
      return;
    }
    if (renderCount > 1) {
      Logger.debug(actionName + " action has more than one @Render annotation. Just one is allowed.");
      return;
    }
    return renderVariable;
  }

  _this.searchVariablesByAnnotationName = function(variables, actionName, annotationName) {
    var renderVariables = [];
    for (var i in variables) {
      for (var a in variables[i]) {
        var annotation = variables[i][a];
        if (annotation.name == annotationName) {
          renderVariables.push({
            name:i,
            meta:variables[i][a]
          })
        }
      }
    }
    return renderVariables;
  }  

  _this.applyActionListenersAutoBinding = function(functions, action) {
    Logger.debug("applying actionListeners auto binding for this action: "+action._ls_name)
    for (var internalActionFunctionName in functions) {
      for (var a in functions[internalActionFunctionName]) {
        var annotation = functions[internalActionFunctionName][a];
        if (annotation.name == 'ActionListener') {
          if (typeof action[internalActionFunctionName] !== "undefined" && typeof action[internalActionFunctionName] === "function") {
            Logger.debug("actionListener to be binded was found: "+internalActionFunctionName)
            var functionInstance = action[internalActionFunctionName];
            var tagNativeId = annotation.arguments.tagId;
            var eventType = annotation.arguments.type;
            var pageNameWhoseContainsDomElements = annotation.arguments.pageName;

            var registeredDomElementsInPage;
            if(typeof _this.dependecyContext[pageNameWhoseContainsDomElements] === 'undefined'){
              Logger.debug(`@ActionListener ${internalActionFunctionName} has a pageName which don't exist in the context: ${pageNameWhoseContainsDomElements}`);
            }else{
              registeredDomElementsInPage = _this.dependecyContext[pageNameWhoseContainsDomElements].getDomElements();
            }
            var lsId = _this.searchLinkStartIdInRegisteredDomElements(registeredDomElementsInPage, 
              annotation.arguments.tagId);
            var domElement;
            if (typeof lsId === 'undefined') {
              Logger.debug(`lsId for this actionListener ${annotation.arguments.tagId} is undefined. Did you register the dom element with ls-element=true ?`);
              Logger.debug(`${annotation.arguments.tagId} will be searched directly in html dom`);
              domElement = document.getElementById(annotation.arguments.tagId);
            }else{
              domElement = _this.getElementByLsId(lsId);
            }            
            if (typeof domElement !== 'undefined' && domElement != null) {
              if (eventType === "onclick") {
                domElement.onclick = functionInstance;
              } else {
                Logger.debug("type function not implemented yet: " + eventType);
              }
            } else {
              Logger.debug(`ActionListener with html tag id: ${annotation.arguments.tagId} was not found in html dom`);
            }
          }
        }
      }
    }
  }

  _this.applyDomElemensAutoBinding = function(action, pageInstanceToRender, variables) {

    Logger.debug("apply dom elements auto binding for this action: "+action._ls_name);

    var variablesAnnotatedWithDomElement = _this.searchVariablesAnnotatedWith(variables, "HtmlElement");

    //iterate every @HtmlElement and perform the binding with real html dom element
    variablesAnnotatedWithDomElement.forEach(function(variable, i) {

      var htmlTagId = variable.annotationArguments.id;
      if (typeof htmlTagId !== 'undefined') {
        Logger.debug(`Searching ${htmlTagId} html element`)
        var searchedHtmlDomElement = _this.getElementInPageRegisteredElements(pageInstanceToRender, htmlTagId, variable.variableName);
        if (typeof searchedHtmlDomElement !== 'undefined') {
          action[variable.variableName] = searchedHtmlDomElement;
          Logger.debug(`Html element with id ${htmlTagId} was binded to ${variable.variableName} on its action.`);
        }else{
          Logger.debug(`Html element with id ${htmlTagId} was not found in LinkStart page registered elements`);
          searchedHtmlDomElement = document.getElementById(htmlTagId);
          if (typeof searchedHtmlDomElement !== 'undefined') {
            //@TODO: show warning if there are several matches
            action[variable.variableName] = searchedHtmlDomElement;
            Logger.debug(`Html element with id ${htmlTagId} was binded to ${variable.variableName} on its action. Id was obtained with document.getElementById`);
          }else{
            Logger.debug(`Html element with id ${htmlTagId} was not found in LinkStart page registered element nor html dom elements`);
          }
        }
      } else {
        Logger.debug(`variable ${variable.variableName} annotated with @HtmlElement does no have [id] argument`);
      }
    });
    if(typeof variablesAnnotatedWithDomElement=== 'undefined' || variablesAnnotatedWithDomElement.length == 0){
      Logger.debug(`this action ${action._ls_name} does not have @HtmlElement`);
    }
  };

  _this.bindDomElementAllForOne = function(action, variableToUseAsRender, variables) {

    if(typeof variableToUseAsRender === 'undefined' || variableToUseAsRender == null){
      return;
    }

    var page = action[variableToUseAsRender];
    let domElements = page.getDomElements();
    var variablesAnnotatedWithDomElement = _this.searchVariablesAnnotatedWith(variables, "HtmlElementsAllForOne");

    //TODO: debug
    if(variablesAnnotatedWithDomElement.length == 0){
      //Logger.debug(`${action._ls_name} does not have any @HtmlElementsAllForOne annotation`);
      return;
    }

    if(variablesAnnotatedWithDomElement.length >1){
      Logger.debug(`${action._ls_name} has more than one @HtmlElementsAllForOne. Just one is allowed`);
      return;
    }

    var internalActionVariableName = variablesAnnotatedWithDomElement[0].variableName;

    if (typeof internalActionVariableName === 'undefined') {
      Logger.debug(`HtmlElementsAllForOne annotation was found but, is not possible to determine the related action variable`);
    }

    //apply binding
    action[internalActionVariableName] = _this.applyHtmlElementsToSingleVariableBinding(page);
  };

  _this.applyHtmlElementsToSingleVariableBinding = function(page) {
    var model = {};

    let modelElements = page.getDomElements();
    if (typeof modelElements === 'undefined' || modelElements.length == 0) {
      return;
    }

    modelElements.forEach(function(modelElement) {
      let tagId = modelElement.tagId;
      let lsId = modelElement.lsId;

      if (tagId && lsId) {
        let domElement = _this.getElementByLsId(lsId);
        if (domElement.tagName === 'INPUT') {

          domElement.addEventListener("change", function(event) {
            if(domElement.type === 'text'){
              model[tagId] = event.target.value;
            }else if(domElement.type === 'radio'){
              model[domElement.name] = event.target.value;
            }else if(domElement.type === 'checkbox'){
              if(domElement.checked === true){
                model[tagId] = true;
              }else{
                model[tagId] = false;
              }
            }
          });
          //set default value

          if(domElement.type === 'text'){
            model[tagId] = domElement.value;
          }else if(domElement.type === 'radio'){
            let radioValue = _this.getDefaultRadioValue(domElement);
            if(typeof radioValue !== 'undefined'){
              model[domElement.name] = radioValue;
            }
          }else if(domElement.type === 'checkbox'){
            let checkboxValue = _this.getDefaultCheckboxValue(domElement);
            model[tagId] = checkboxValue;
          }

        } else if (domElement.tagName === 'SELECT') {
          domElement.addEventListener("change", function(event) {
            model[tagId] = event.target.value;
          });
          //set default value
          model[tagId] = _this.getDefaultSelectValue(domElement);
        } else {
          Logger.debug("Model binding is not implemented yet for this tag:" + domElement.tagName);
        }
      }
    });

    return model;
  }

  _this.searchVariablesAnnotatedWith = function(variables, annotationName) {
    var foundvariables = [];
    for (var i in variables) {
      for (var a in variables[i]) {
        var annotation = variables[i][a];
        if (annotation.name == annotationName) {
          foundvariables.push({
            variableName: i,
            annotationArguments: annotation.arguments
          });
        }
      }
    }
    return foundvariables;
  }

  _this.isFunctionAnnotatedWith = function(actionAnnotationInfo, functionName, annotationName) {
    var functions = actionAnnotationInfo.functions;

    if(typeof functions[functionName]==='undefined'){
      Logger.debug(`${functionName} function does not exist in this action as annotated function`);
      return false;
    }

    for (var annotationIndex in functions[functionName]) {
      var annotation = functions[functionName][annotationIndex];
      if(annotation.name === annotationName){
        Logger.debug("is async!");
        return true;
      }
    }
  }

  _this.searchLinkStartIdInRegisteredDomElements = function(registeredDomElementsInPage, tagId) {
    for (var d in registeredDomElementsInPage) {

      if (typeof registeredDomElementsInPage[d] === 'undefined') {
        continue;
      }

      if (typeof registeredDomElementsInPage[d].tagId === 'undefined') {
        continue;
      }

      if (registeredDomElementsInPage[d].tagId == tagId) {
        return registeredDomElementsInPage[d].lsId
      }
    }
  };

  _this.getElementByLsId = function(lsId) {
    let list = document.querySelectorAll('[ls-id="' + lsId + '"]');
    if (list.length == 0) {
      Logger.debug("There are not any element with lsId:" + lsId);
    } else if (list.length == 1) {
      return list[0];
    } else {
      Logger.debug("There are more than one element with this lsId:" + lsId);
    }
  };

  _this.getElementInPageRegisteredElements = function(pageInstanceToRender, htmlTagId, variableNameToBind) {
    let domElements = pageInstanceToRender.getDomElements();
    var searchedHtmlDomElement;
    for (var elementInDom of domElements) {
      var tagId = elementInDom.tagId;
      var lsId = elementInDom.lsId;
      if ((tagId && lsId) && tagId === htmlTagId) {
        searchedHtmlDomElement = _this.getElementByLsId(lsId);
        break;
      }
    }
    return searchedHtmlDomElement;
  };

  _this.getDefaultRadioValue = function(radioElement) {
    if(radioElement.checked === true){
      return radioElement.value;
    }
  }

  _this.getDefaultCheckboxValue = function(checkboxElement) {
    if(checkboxElement.checked === true){
      return true;
    }else{
      return false;
    }
  }

  _this.getDefaultSelectValue = function(selectElement) {
    var myOptions = selectElement.options;
    for (var i = 0; i < myOptions.length; i++) {
      var isDefSelected = myOptions[i].selected;
      if (isDefSelected) {
        return myOptions[i].value;
      }
    }
  }

  _this.getAnnotationArgumentsOfUniqueFunctionAnnotated = function(handler, expectedAnnotation) {
    
    var functions = _this.metaContext[handler._ls_name].functions;
    var metaArguments = [];
    for (var internalActionFunctionName in functions) {
      for (var a in functions[internalActionFunctionName]) {
        var annotation = functions[internalActionFunctionName][a];
        if (annotation.name == expectedAnnotation) {
          metaArguments.push(annotation.arguments)
        }  
      }  
    }
    if(metaArguments.length>1){
      Logger.debug(`${handler._ls_name} handler has more than one @${expectedAnnotation}`)
      return;
    }

    return metaArguments[0];
  }    

  //TODO: how initialize onclick before dom insertion

  window.onhashchange = _this.locationHashChanged;

  function eventRouter(e) {
    if(typeof e.detail.eventId === 'undefined' || e.detail.eventId == null){
      Logger.error("simple-event don't have eventId");
      return;
    }
    if (typeof _this.dependecyContext[`${e.detail.eventId}`] !== 'undefined') {
      var handler = _this.dependecyContext[`${e.detail.eventId}`];
      var params = e.detail.params;
      _this.invokeHandler(handler, params);
    }
  }   

  @globalBottomVariablesSentence
  document.addEventListener("simple-event", eventRouter);

}

function linkStart(options) {

  document.addEventListener("DOMContentLoaded", function(event) {
    Logger.info("Linkstart!!");  
    let linkStartApplication = new LinkStartApplication();
    linkStartApplication.start(options);    
  }); 
}
