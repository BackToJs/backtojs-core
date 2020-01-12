//https://stackoverflow.com/questions/45540613/how-document-fragment-works

function Home() {
  _this = this;

  this.getInstance = function() {
      return _this;
  }
}

module.exports = Home;

Home.prototype.render = function() {
  let frag = document.createRange().createContextualFragment(_this.template());
  return frag;
}

Home.prototype.homeButtonOnClick = function(e) {
  _this.navigation.route('map');
}
