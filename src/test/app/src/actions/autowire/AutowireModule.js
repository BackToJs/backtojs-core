@DefaultAction(name="autowireModule", route="autowireModule"  )
function AutowireModule() {

  @Autowire(name = "module")
  this.module;

  this.render = () => {
    return this.module.doSomething();
  };

}

module.exports = AutowireModule;
