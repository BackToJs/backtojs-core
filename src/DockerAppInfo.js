var Div = require("./org/lassiejs/components/basic/Div.js");

function DockerAppInfo() {
  this.template = `
  <div>
      <span id="name"></span><br>
      <span id="technology"></span><br>
      <span id="port"></span>
  </div>
  `;

}

DockerAppInfo.prototype = Object.create(Div.prototype);

module.exports = DockerAppInfo;
