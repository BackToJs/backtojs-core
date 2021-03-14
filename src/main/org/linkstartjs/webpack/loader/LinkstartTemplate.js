import './styles/index.scss'

function Logger(){}

Logger.debug = function(message){
  if(typeof LinkStartOptions !== 'undefined' && typeof LinkStartOptions.logLevel !== 'undefined' && LinkStartOptions.logLevel==="debug"){
    if(typeof message === 'object'){
      console.log(JSON.stringify(message, null, 4));
    }else{
      console.log(message);
    }
  }
}

Logger.info = function(message){
  if(typeof LinkStartOptions !== 'undefined' && typeof LinkStartOptions.logLevel !== 'undefined' && LinkStartOptions.logLevel==="debug"){
    console.log(JSON.stringify(message, null, 4));
  }else{
    console.log(message);
  }
}

function LinkStartRoute(){}

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


  _this.start = function(options) {

    global.LinkStartOptions = options;

    _this.registerDependenciesInContext();
    _this.performInjection();
    _this.registerMetadataByDependency();
    _this.registerDependenciesByUrlFragment();


    if (_this.defaultFragmentUrlRoute && _this.actionsByFragmentUrlRoute[_this.defaultFragmentUrlRoute]) {
      Logger.debug("default action detected: " + _this.defaultFragmentUrlRoute);
      _this.invokeActionByFragmentUrl(_this.defaultFragmentUrlRoute);
    } else {
      Logger.debug('There are not any @Action defined as entrypoint');
    }
  };

  _this.invokeActionByFragmentUrl = function(route) {

    Logger.debug(`triggering action by route: ${route}`);
    var action = _this.actionsByFragmentUrlRoute[route];
    Logger.debug(`ls_name: ${action._ls_name}`);

    if (typeof action === 'undefined') {
      Logger.debug(`route ${route} has a wrong or undefined action`);
      return;
    }

    if (typeof action.onLoad !== "undefined" && typeof action.onLoad === "function") {
      var isLoadAsync = _this.isFunctionAnnotatedWith(_this.metaContext[action._ls_name], "onLoad", "Async");
      if(isLoadAsync){//onLoad is async
        Logger.debug("onLoad is Async");
        action.onLoad(function(){
          _this.performRender(action);
        });
      }else{
        Logger.debug("onLoad is not Async");
        action.onLoad();
        _this.performRender(action);
      }
    } else {
      Logger.debug("Action does not have onLoad() method");
      _this.performRender(action);
    }

  };

  _this.performRender = function(action) {
    var isRenderAnAnnotation=false;
    //TODO: ensure render is executed after onLoad
    if (typeof action.render !== "undefined" && typeof action.render === "function") {
      // throw new Error("Render function execution is not supported yet");
      var htmlAsString = action.render();
      var htmlToRender = document.createRange().createContextualFragment(htmlAsString);
      document.getElementById("root").innerHTML = '';
      document.getElementById("root").appendChild(htmlToRender);
      //html dom is ready
      //bind dom onclick events to action methods
    } else {
      //search if exist @Render annotation which indicate us that is an alternative
      //to render() method
      if (typeof action._ls_name === 'undefined' || action._ls_name == null) {
        Logger.debug("Something is wrong with this action. _ls_name is undefined");
        return;
      }

      if (typeof _this.metaContext[action._ls_name] === 'undefined' || _this.metaContext[action._ls_name] == null) {
        Logger.debug("Something is wrong with this action. there is not exist in metaContext");
        return;
      }

      var variableToUseAsRenderData = _this.searchOneVariableByAnnotationName(_this.metaContext[action._ls_name].variables, action._ls_name, "Render");

      if (typeof variableToUseAsRenderData === 'undefined' || variableToUseAsRenderData == null) {
        Logger.debug(action._ls_name + " action does not have render() method nor @Render annotation");
        return;
      }

      var variableToUseAsRender = variableToUseAsRenderData.name;

      if (typeof variableToUseAsRender === 'undefined' || variableToUseAsRender == null) {
        Logger.debug(action._ls_name + " action does not have render() method nor @Render annotation");
        return;
      }

      //get id to renderization target
      var renderizationTargetHtmlId;
      if(typeof variableToUseAsRenderData.meta === 'undefined' || typeof variableToUseAsRenderData.meta.arguments === 'undefined' ){
        renderizationTargetHtmlId = "root";
      }else if(typeof variableToUseAsRenderData.meta.arguments.id === 'undefined' ){
        renderizationTargetHtmlId = "root";
      }else{
        renderizationTargetHtmlId = variableToUseAsRenderData.meta.arguments.id
      }

      var htmlToRender = document.createRange().createContextualFragment(action[variableToUseAsRender].getHtml());
      document.getElementById(renderizationTargetHtmlId).innerHTML = '';
      document.getElementById(renderizationTargetHtmlId).appendChild(htmlToRender);
      isRenderAnAnnotation = true;
    }

    //html dom is ready

    //bind dom onclick events to action methods
    _this.applyActionListenersAutoBinding(_this.metaContext[action._ls_name].functions, action, (isRenderAnAnnotation===true)?action[variableToUseAsRender].getDomElements():null);

    //bind dom variables to action variables
    _this.applyDomElemensAutoBinding(action, action[variableToUseAsRender], _this.metaContext[action._ls_name].variables);

    //allForOne
    _this.bindDomElementAllForOne(action, action[variableToUseAsRender], _this.metaContext[action._ls_name].variables);
  }

  _this.locationHashChanged = function() {
    Logger.debug(`url change: ${location.hash}`);
    var fragment = location.hash.replace("#", "");
    if (!_this.actionsByFragmentUrlRoute[fragment]) {
      Logger.debug("There are not any @Action asociated to this route: " + fragment);
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

  _this.applyActionListenersAutoBinding = function(functions, action, registeredDomElementsInPage) {
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

            var lsId = _this.searchLinkStartIdInRegisteredDomElements(registeredDomElementsInPage, annotation.arguments.tagId);
            var domElement;
            if (typeof lsId === 'undefined') {
              Logger.debug(`lsId for this actionListener ${annotation.arguments.tagId} is undefined. Did you register the dom element with ls-element=true ?`);
              Logger.debug(`${annotation.arguments.tagId} will be searched directly in html dom`);
              domElement = document.getElementById(annotation.arguments.tagId);
            }else{
              domElement = _this.getElementByLsId(lsId);
            }
            Logger.debug("actionListener object:"+domElement)
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
    // let domElements = page.getDomElements();

    //iterate every @HtmlElement and perform the binding with real html dom element
    variablesAnnotatedWithDomElement.forEach(function(variable, i) {

      var htmlTagId = variable.annotationArguments.id;
      if (typeof elementDomId !== 'undefined') {
        Logger.debug(`Searching ${htmlTagId} html element`)
        // for (var elementInDom of domElements) {
        //   var tagId = elementInDom.tagId;
        //   var lsId = elementInDom.lsId;
        //   if ((tagId && lsId) && tagId === elementDomId) {
        //     action[variable.variableName] = _this.getElementByLsId(lsId);
        //   }
        // }
        var searchedHtmlDomElement = _this.getElementInPageRegisteredElements(pageInstanceToRender, htmlTagId, variable.variableName);
        if (typeof searchedHtmlDomElement !== 'undefined') {
          action[variable.variableName] = searchedHtmlDomElement;
        }else{
          Logger.debug(`Html element with id ${htmlTagId} was not found in LinkStart page registered elements`);
          searchedHtmlDomElement = document.getElementById(htmlTagId);
          if (typeof searchedHtmlDomElement !== 'undefined') {
            //@TODO: show warning if there are several matches
            action[variable.variableName] = searchedHtmlDomElement;
          }else{
            Logger.debug(`Html element with id ${htmlTagId} was not found in LinkStart page registered element nor html dom elements`);
          }
        }
      } else {
        Logger.debug(`variable ${variable.variableName} annotated with @DomElement does no have [id] argument`);
      }
    });
  };

  _this.bindDomElementAllForOne = function(action, page, variables) {

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

  //TODO: how initialize onclick before dom insertion

  window.onhashchange = _this.locationHashChanged;

  @defaultFragmentUrlSentence

}

function linkStart(options) {
  let linkStartApplication = new LinkStartApplication();
  linkStartApplication.start(options);
}
