@DefaultAction(name="defaultActionModule", entrypoint="true", route="entrypoint"  )
function DefaultActionModule() {

  this.lifeCycle = [];

  this.onLoad = () => {
    this.lifeCycle.push("onLoad");
  };

  this.render = () => {
    this.lifeCycle.push("render");
    return JSON.stringify({"lifeCycle":this.lifeCycle});
  };

}

module.exports = DefaultActionModule;
