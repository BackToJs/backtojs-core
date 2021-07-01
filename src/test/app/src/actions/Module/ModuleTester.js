@DefaultAction(name="moduleTester", route="moduleTester"  )
function ModuleTester() {

  @Autowire(name = "module")
  this.module;

  this.render = () => {
    return this.module.doSomething();
  };

}

module.exports = ModuleTester;
