//import './styles/index.scss'
// import '/home/jarvis/Github/linkstart-demos/hello_world_render/src/pages/hello_world/index.html'

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


  _this.start = function() {

    _this.registerDependenciesInContext();
    _this.performInjection();
    _this.registerMetadataByDependency();
    _this.registerDependenciesByUrlFragment();


    if (_this.defaultFragmentUrlRoute && _this.actionsByFragmentUrlRoute[_this.defaultFragmentUrlRoute]) {
      console.log("default action detected: " + _this.defaultFragmentUrlRoute);
      _this.invokeActionByFragmentUrl(_this.defaultFragmentUrlRoute);
    } else {
      console.log('There are not any @Action defined as entrypoint');
    }
  };

  _this.invokeActionByFragmentUrl = function(route) {

    var action = _this.actionsByFragmentUrlRoute[route];

    if (typeof action === 'undefined') {
      console.log(`route ${route} has a wrong or undefined action`);
      return;
    }

    if (typeof action.onLoad !== "undefined" && typeof action.onLoad === "function") {
      action.onLoad();
    } else {
      console.log("Action does not have onLoad() method");
    }
    //TODO: ensure render is executed after onLoad
    if (typeof action.render !== "undefined" && typeof action.render === "function") {
      throw new Error("Render function execution is not supported yet");
    } else {
      //search if exist @Render annotation which indicate us that is an alternative
      //to render() method
      if(typeof action._ls_name === 'undefined' || action._ls_name == null){
        console.log("Something is wrong with this action. _ls_name is undefined");
        return;
      }

      if(typeof _this.metaContext[action._ls_name] === 'undefined' || _this.metaContext[action._ls_name] == null){
        console.log("Something is wrong with this action. there is not exist in metaContext");
        return;
      }

      var variableToUseAsRender = _this.searchAtLeastOneVariableToRender(_this.metaContext[action._ls_name].variables, action._ls_name);

      if(typeof variableToUseAsRender === 'undefined' || variableToUseAsRender == null){
        console.log(action._ls_name+" action does not have render() method nor @Render annotation");
        return;
      }

      var htmlToRender = document.createRange().createContextualFragment(action[variableToUseAsRender].getHtml());
      document.getElementById("root").innerHTML = '';
      document.getElementById("root").appendChild(htmlToRender);

      //html dom is ready, bind variables and ActionListeners will be start

      _this.applyActionListenersAutoBinding(_this.metaContext[action._ls_name].functions, action, action[variableToUseAsRender].getDomElements());
    }
  };

  _this.locationHashChanged = function() {
    console.log(location.hash);
    var fragment = location.hash.replace("#", "");
    if (!_this.actionsByFragmentUrlRoute[fragment]) {
      console.log("There are not any @Action asociated to this route: " + fragment);
      return;
    }
    _this.invokeActionByFragmentUrl(fragment);
  }

  _this.searchAtLeastOneVariableToRender = function(variables, actionName) {
    var renderCount = 0;
    var renderVariableName;
    for(var i in variables){
      for(var a in variables[i]){
        var annotation = variables[i][a];
        if(annotation.name == 'Render'){
          renderCount ++;
          renderVariableName = i;
        }
      }
    }

    if(renderCount == 0){
      console.log(actionName+" action does not have any @Render annotation");
      return;
    }
    if(renderCount>1){
      console.log(actionName+" action has more than one @Render annotation. Just one is allowed.");
      return;
    }

    return renderVariableName;
  }

  _this.applyActionListenersAutoBinding = function(functions, action, registeredDomElementsInPage) {
    for(var internalActionFunctionName in functions){
      for(var a in functions[internalActionFunctionName]){
        var annotation = functions[internalActionFunctionName][a];
        if(annotation.name == 'ActionListener'){
          if (typeof action[internalActionFunctionName] !== "undefined" && typeof action[internalActionFunctionName] === "function") {
            var functionInstance = action[internalActionFunctionName];
            var tagNativeId = annotation.arguments.tagId;
            var eventType = annotation.arguments.type;

            var lsId = _this.searchLinkStartIdInRegisteredDomElements(registeredDomElementsInPage, annotation.arguments.tagId);

            if(typeof lsId === 'undefined'){
              console.log(`lsId for this element ${annotation.arguments.tagId} is undefined. Did you register the dom element with ls-element=true ?`);
              continue;
            }
            var domElement = _this.getElementByLsId(lsId);
            if(typeof domElement !== 'undefined'){
              if(eventType === "onclick"){
                domElement.onclick = functionInstance;
              }else{
                console.log("type function not implemented yet: "+eventType);
              }
            }else{
              console.log("expected element was not found in html dom");
            }
          }
        }
      }
    }
  }

  _this.searchLinkStartIdInRegisteredDomElements = function (registeredDomElementsInPage, tagId) {
    for(var d in registeredDomElementsInPage){

      if(typeof registeredDomElementsInPage[d] === 'undefined'){
        continue;
      }

      if(typeof registeredDomElementsInPage[d].tagId === 'undefined'){
        continue;
      }

      if(registeredDomElementsInPage[d].tagId == tagId){
        return registeredDomElementsInPage[d].lsId
      }
    }
  };

  _this.getElementByLsId = function (lsId) {
    let list = document.querySelectorAll('[ls-id="' + lsId + '"]');
    if (list.length == 0) {
      console.log("There are not any element with lsId:" + lsId);
    }else if (list.length == 1) {
      return list[0];
    } else {
      console.log("There are more than one element with this lsId:" + lsId);
    }
  };

  //TODO: how initialize onclick before dom insertion

  window.onhashchange = _this.locationHashChanged;

  @defaultFragmentUrlSentence

}

function linkStart() {
  let linkStartApplication = new LinkStartApplication();
  linkStartApplication.start();
}
