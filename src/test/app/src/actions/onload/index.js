@DefaultAction(name="onLoadAction", entrypoint="true", route="onLoadAction"  )
function HelloWorldAction() {

  this.message;

  this.onLoad = () => {
    console.log("I'm the onLoad");
    this.message = "I'm the onLoad";
  };

  this.render = () => {
    return this.message;
  };

}

module.exports = HelloWorldAction;
