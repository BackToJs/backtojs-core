function NoUrlRoute() {
  this._self = this;
}

module.exports = NoUrlRoute;

NoUrlRoute.switch = function (pageComponent) {
  var element = pageComponent.render();
  document.getElementById("root").innerHTML = '';
  document.getElementById("root").appendChild(element);

  //TODO: how initialize onclick before dom insertion?
  pageComponent.initializeActionListeners();
};
