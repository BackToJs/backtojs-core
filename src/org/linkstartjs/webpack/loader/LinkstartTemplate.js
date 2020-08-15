//import './styles/index.scss'

function LinkStartApplication() {

  var _this = this;
  _this.context = {};
  _this.actionsByFragmentUrlRoute = {};


  _this.registerDependenciesInContext = function() {
    @require
    @instantiate
  }

  _this.performInjection = function() {

  }

  _this.registerDependenciesByUrlFragment = function() {
    @fragmentListeners
  }


  _this.start = function() {

    _this.registerDependenciesInContext();
    _this.performInjection();
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

    console.log(action);

    if(typeof action === 'undefined'){
      console.log(`route ${route} has a wrong or undefined action`);
      return;
    }

    if (typeof action.onLoad !== "undefined" && typeof action.onLoad === "function") {
      action.onLoad();
    } else {
        console.log("Action does not have onLoad() method");
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

  //TODO: how initialize onclick before dom insertion

  window.onhashchange = _this.locationHashChanged;

  @defaultFragmentUrlSentence

}

function linkStart() {
  let linkStartApplication = new LinkStartApplication();
  linkStartApplication.start();
}
