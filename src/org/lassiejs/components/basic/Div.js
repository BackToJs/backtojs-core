var Generic = require("./Generic.js");

function Div() {
  this.sourceDomObject = document.createElement("div");
}

Div.prototype = Object.create(Generic.prototype);

module.exports = Div;
