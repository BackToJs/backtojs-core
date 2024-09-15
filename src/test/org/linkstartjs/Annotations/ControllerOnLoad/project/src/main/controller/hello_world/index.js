[EventHandler(entrypoint = "true")]
function HelloWorldController() {

  this.onLoad = () => {
    return new Promise(async(resolve, reject) => {
      console.log("I'm the onLoad");
      resolve();
    });    
  };
  
}
module.exports = HelloWorldController;
