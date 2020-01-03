//https://stackoverflow.com/questions/45540613/how-document-fragment-works

function Home() {
  _this = this;
}

module.exports = Home;

Home.prototype.render = function() {
  console.log("home render:");
  let frag = document.createRange().createContextualFragment(_this.template());
  return frag;
}
