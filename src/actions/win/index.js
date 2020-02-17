//@PageListener(name="winListener", fragmentUrlId="win"  )
function Win() {
  var _this = this;

  //@Autowire
  var winHtmlTemplate;

  _this.backButtonOnClick = function(e) {
    window.location = ''
  }

  _this.render = function() {
    let frag = document.createRange().createContextualFragment(_this.winHtmlTemplate.getHtml());
    return frag;
  }

  _this.applyBindings = function() {
    let backButton = document.getElementById("backButton");
    backButton.onclick = _this.backButtonOnClick;
  }

}

module.exports = Win;
