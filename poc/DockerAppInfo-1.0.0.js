var Div = require("./org/lassiejs/components/basic/Div.js");

function DockerAppInfo() {
  this.data = null;
  this.template = `
  <div>
      <span style="" id="name"></span><br>
      <span id="technology"></span><br>
      <span id="port"></span>
  </div>
  `;

}

DockerAppInfo.prototype = Object.create(Div.prototype);

DockerAppInfo.prototype.render = function() {
  if (this.template) {
    let generic = document.createElement("template");
    generic.innerHTML = this.template;
    let object = generic.content;
    var childNodes = object.childNodes;
    for (key in childNodes) {
      //only ui objects instead #text in documentFragment
      if (typeof childNodes[key] === typeof {} && !(childNodes[key].data)) {
        var uiNodes = childNodes[key].childNodes;
        //searching children
        for (objectKey in uiNodes) {

          if (typeof uiNodes[objectKey] === typeof {} && !(uiNodes[objectKey].data)) {

            if (this.data && uiNodes[objectKey].id) {
              if (uiNodes[objectKey].tagName == "SPAN") {
                uiNodes[objectKey].innerHTML = this.data[uiNodes[objectKey].id];
              }
            }
          }
        }

      }
    }
    return object;
  }
}

DockerAppInfo.prototype.setData = function(data) {
  this.data = data;
}



module.exports = DockerAppInfo;
