@DefaultAction(name="autowireDependencyContext", route="autowireDependencyContext"  )
function AutowireDependencyContext() {

  @Autowire(name = "linksStartContext")
  this.linksStartContext;

  this.render = () => {
    return JSON.stringify(this.linksStartContext.getDependecyContext());
  };

}

module.exports = AutowireDependencyContext;
