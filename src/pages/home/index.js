//@PageListener(name="home", mainPage="true")
function Home() {
  var _this = this;

  _this.homeButtonOnClick = function(e) {
    window.location = '#win'
  }

}

module.exports = Home;
