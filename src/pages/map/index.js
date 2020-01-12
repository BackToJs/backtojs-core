//https://stackoverflow.com/questions/45540613/how-document-fragment-works

function Map() {
  this._self = this;
}

module.exports = Map;

Map.prototype.render = function() {
  let frag = document.createRange().createContextualFragment(this._self.template());
  return frag;
}

Map.prototype.backButtonOnClick = function(e) {
  console.log("on click");
  console.log(e);
}
