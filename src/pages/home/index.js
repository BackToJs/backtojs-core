function Home() {
  var _this = this;

  _this.homeButtonOnClick = function(e) {
    console.log("i am the click on home");
    var navigation = _this['navigation'];
    navigation.route('map');
  }

}

module.exports = Home;
