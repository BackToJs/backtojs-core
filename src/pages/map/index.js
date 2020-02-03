//@Dependency("Map")
function Map() {
  var _this = this;

  _this.backButtonOnClick = function(e) {
    console.log("on click");
    console.log(e);
  }

}

module.exports = Map;
