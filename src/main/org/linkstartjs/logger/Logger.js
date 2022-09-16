function Logger(){

}

Logger.debug = function(message){
  if(typeof linkstartJsLogLevel !== 'undefined' && linkstartJsLogLevel==="debug"){
    console.log(message);
  }
}

Logger.info = function(message){
  console.log(message);
}

module.exports = Logger;
