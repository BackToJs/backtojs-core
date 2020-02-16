//@PageListener(name="homeListener", entrypoint="true", fragmentUrlId="home"  )
function Home() {
  var _this = this;

  //@Autowire
  var homeHtmlTemplate;

  _this.homeButtonOnClick = function(e) {
    window.location = '#win'
  }

  _this.render = function() {
    let frag = document.createRange().createContextualFragment(_this.homeHtmlTemplate);
    return frag;
  }

}

module.exports = Home;
