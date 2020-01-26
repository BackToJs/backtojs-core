// const Di4js = require('../org/jrichardsz/di4js')

function NavigationController() {
  var _this = this;

  _this.rule = {
    "main" : "home"
  };

  _this.main = function () {
    console.log("starting default navigation");
    _this.route(_this.rule.main);
  };

  _this.route = function (viewId) {
    console.log("route to:"+viewId);
    var view = _this[viewId];
    var element = view.render();
    document.getElementById("root").innerHTML = '';
    document.getElementById("root").appendChild(element);
    //TODO: how initialize onclick before dom insertion
    view.initializeActionListeners();
  };
}

module.exports = NavigationController;
