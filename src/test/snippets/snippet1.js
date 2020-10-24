import './styles/index.scss'

function LinkStartApplication() {

  var _this = this;
  _this.context = {};
  _this.listenersByFragmentUrlId = {};


  _this.start = function() {

    const HelloWorldAction = require('src/actions/hello_world/index.js');

    _this.context["helloWorldAction"] = new HelloWorldAction();
    //@injection

    _this.listenersByFragmentUrlId["hello"] = _this.context["helloWorldAction"];

    if (_this.entrypointFragmentUrlId && _this.listenersByFragmentUrlId[_this.entrypointFragmentUrlId]) {
      console.log("default route detected: " + _this.entrypointFragmentUrlId);
      _this.route(_this.entrypointFragmentUrlId);
    } else {
      console.log('There are not any @Action defined as entrypoint');
    }
  };

  _this.applyActionBinding = function(action) {
    console.log("applyActionBinding is starting");
    let page = action[action.ls_render];
    let actionListeners = action.ls_actionListeners;
    let elements = page.getElements();
    console.log(elements);

    if (typeof page === 'undefined') {
      console.log("defaultPage for this action is undefined");
      return;
    }

    if (typeof actionListeners === 'undefined' || actionListeners.length == 0) {
      return;
    }
    Object.keys(actionListeners).forEach(function(key, index) {
      elements.forEach(function(element) {
        //if exist as model
        if (actionListeners[key].tagId === element.tagId) {
          //if has ls id
          if (typeof element.lsId !== 'undefined') {
            //if exist as action function
            if (typeof action[key] !== "undefined" && typeof action[key] === "function") {
              let functionInstance = action[key];
              let typeFunction = actionListeners[key].typeFunction;
              let domElement = _this.getElementByLsId(element.lsId);
              if (typeof domElement !== 'undefined') {
                if (typeFunction === "onclick") {
                  domElement.onclick = functionInstance;
                } else {
                  console.log("type action not implemented yet: " + typeFunction);
                }
              } else {
                console.log("element was not found in dom. tagId=" + element.tagId + " lsId=" + element.lsId);
              }
            } else {
              console.log(key + " is undefined or is not a function in @Action");
            }
          } else {
            console.log(key + " does not have ls-id");
          }
        } else {
          console.log(element.tagId + " is not registered as @actionListener");
        }
      });

    });
  };

  _this.applyDomBinding = function(action) {
    console.log("applyDomBinding is starting");
    let domElementsToSearch = action.ls_domElements;
    let page = action[action.ls_render];
    let elements = page.getElements();

    Object.keys(domElementsToSearch).forEach(function(key, index) {
      let tagIdToSearch = domElementsToSearch[key];
      for (let element of elements) {
        let tagId = element.tagId;
        let lsId = element.lsId;
        if ((tagId && lsId) && tagId === tagIdToSearch) {
          action[key] = element = _this.getElementByLsId(lsId);
        }
      }
    });
  };

  _this.getElementByLsId = function(lsId) {
    let list = document.querySelectorAll('[ls-id="' + lsId + '"]');
    if (list.length == 1) {
      return list[0];
    } else {
      console.log("There are not any element or there are more than one:" + lsId);
    }
  };


  _this.route = function(route) {
    console.log("route is starting");
    var pageListener = _this.listenersByFragmentUrlId[route];

    var htmlToRender;
    if (typeof pageListener.render !== "undefined" && typeof pageListener.render === "function") {
      htmlToRender = pageListener.render();
    } else {
      if (typeof pageListener.ls_render !== "undefined" && pageListener[pageListener.ls_render] !== "undefined") {
        htmlToRender = document.createRange().createContextualFragment(pageListener[pageListener.ls_render].getHtml());
      } else {
        console.log("Action does not have render() method nor @DefaultPage annotation");
      }
    }

    document.getElementById("root").innerHTML = '';
    document.getElementById("root").appendChild(htmlToRender);

    if (typeof pageListener.applyBindings !== "undefined" && typeof pageListener.applyBindings === "function") {
      pageListener.applyBindings();
    } else {
      if (typeof pageListener.ls_actionListeners !== "undefined") {
        _this.applyActionBinding(pageListener);
      }
      if (typeof pageListener.ls_domElements !== "undefined") {
        _this.applyDomBinding(pageListener);
      }
    }
  };


  function locationHashChanged() {
    console.log(location.hash);
    var fragment = location.hash.replace("#", "");
    if (!_this.listenersByFragmentUrlId[fragment]) {
      console.log("There are not any @Action asociated to this route: " + fragment);
      return;
    }
    _this.route(fragment);
  }
  window.onhashchange = locationHashChanged;

  _this.entrypointFragmentUrlId = "hello";

}




function linkStart() {
  let linkStartApplication = new LinkStartApplication();
  linkStartApplication.start();
}
