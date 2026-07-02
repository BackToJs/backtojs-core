[EventHandler(entrypoint = "true")]
function HelloWorldController() {

  this.valueToRender;

  this.onLoad = () => {
    return new Promise(async(resolve, reject) => {
      this.valueToRender = "b9e424c3-6974-4d4e-baf2-8a8c904f31f6"
      resolve();
    });    
  };

  this.render = () => {
    return this.page.getHtml();
  };
  
}
module.exports = HelloWorldController;
