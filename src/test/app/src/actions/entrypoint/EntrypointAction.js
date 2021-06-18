@DefaultAction(name="entrypointAction", entrypoint="true", route="entrypoint"  )
function EntrypointAction() {

  this.message;

  this.onLoad = () => {
    this.message = "I'm the onLoad of the entrypoint action";
  };

  this.render = () => {
    return this.message;
  };

}

module.exports = EntrypointAction;
