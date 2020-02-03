//@Dependency("Home")
function Home() {
  var _this = this;

  //@Autowire
  var navigationController;

  _this.homeButtonOnClick = function(e) {
    console.log(_this.navigationController);
    console.log("i am the click on home");
    var navigation = _this['navigation'];
    navigation.route('map');
    // _this.navigationController.route('map');
  }

}

module.exports = Home;
