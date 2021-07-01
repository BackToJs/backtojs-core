@DefaultAction(name="defaultAction", entrypoint="true", route="entrypoint"  )
function DefaultAction() {

  this.render = () => {
    return "I'm an action which is the entrypoint";
  };

}

module.exports = DefaultAction;
