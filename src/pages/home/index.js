//https://stackoverflow.com/questions/45540613/how-document-fragment-works

function Home() {
  _this = this;

  this.getInstance = function() {
      return _this;
  }
}

module.exports = Home;

Home.prototype.render = function() {
  console.log("render:"+this.getInstance());
  console.log(_this);
  let frag = document.createRange().createContextualFragment(_this.template());
  return frag;
}

Home.prototype.homeButtonOnClick = function(e) {
  console.log("on click");
  console.log(_this);
  console.log(_this.navigation);
  _this.navigation.route('map');
}
