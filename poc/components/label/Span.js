var Generic = require("../basic/Generic.js");

function Span() {
  this.sourceDomObject = document.createElement("span");
}

Span.prototype = Object.create(Generic.prototype);

module.exports = Span;
