// const Di4js = require('../org/jrichardsz/di4js')

function NavigationController() {
  this._self = this;
  this.rule = {
    "main" : "home"
  };
}

module.exports = NavigationController;

NavigationController.prototype.main = function () {
  console.log("starting navigation controller...");
  this._self.route(this._self.rule.main);
};

NavigationController.prototype.route = function (viewId) {
  console.log(this);
  var view = this[viewId];
  var element = view.render();
  document.getElementById("root").innerHTML = '';
  document.getElementById("root").appendChild(element);
  //TODO: how initialize onclick before dom insertion
  view.initializeActionListeners();
};
