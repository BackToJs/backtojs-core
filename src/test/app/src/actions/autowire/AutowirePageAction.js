@DefaultAction(name="autowirePageAction", route="simple-autowire"  )
function AutowirePageAction() {

  @Autowire(name = "simplePage")
  this.page;

  this.onLoad = () => {
    console.log("im the onload");
  };

  this.render = () => {
    return this.page.getHtml();
  };

}

module.exports = AutowirePageAction;
