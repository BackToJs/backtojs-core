@DefaultAction(name="helloWorldAction", entrypoint="true", route="hello"  )
function HelloWorldAction() {

  this.onLoad = () => {
    console.log("I'm the onLoad");
  };

  this.render = () => {
    return "<h3>Hello world with LinkStart</h3>";
  };

}

module.exports = HelloWorldAction;
