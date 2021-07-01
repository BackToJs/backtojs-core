@Module(name="module")
function Module() {

  this.doSomething = () => {
    return "I'm a function of Module";
  };
}

module.exports = Module;
