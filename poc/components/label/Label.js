var Generic = require("../basic/Generic.js");

function Label() {
  this.sourceDomObject = document.createElement("label");
}

Label.prototype = Object.create(Generic.prototype);

module.exports = Label;
