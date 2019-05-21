/*
https://stackoverflow.com/a/8100952/3957754
*/
function Controller(dockerInfoUi) {
  _this = this;
  _this.dockerInfoUi = dockerInfoUi;

  if (document.readyState === "complete") {
    _this.perform();
  } else {
    //Add onload or DOMContentLoaded event listeners here: for example,
    // window.addEventListener("onload", function () {
    // _this.perform();
    // }, false);
    // or
    document.addEventListener("DOMContentLoaded", function() {
      _this.perform();
    }, false);
  }

}

Controller.prototype.perform = function() {
  _this.dockerInfoUi.sourceDomObject.addEventListener("click", function() {
    console.log(_this.dockerInfoUi.getElementByName("name"));
    console.log(_this.dockerInfoUi.getElementByName("name").innerHTML);
  });
}


module.exports = Controller;
