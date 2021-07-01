@DefaultAction(name="autowirePage", route="autowirePage"  )
function AutowirePage() {

  @Autowire(name = "simplePage")
  this.page;

  this.render = () => {
    return this.page.getHtml();
  };

}

module.exports = AutowirePage;
