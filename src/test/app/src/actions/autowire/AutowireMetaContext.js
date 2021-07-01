@DefaultAction(name="autowireMetaContext", route="autowireMetaContext"  )
function AutowireMetaContext() {

  @Autowire(name = "linksStartContext")
  this.linksStartContext;

  this.render = () => {
    return JSON.stringify(this.linksStartContext.getMetaContext());
  };

}

module.exports = AutowireMetaContext;
