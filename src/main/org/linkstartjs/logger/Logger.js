function Logger(){

}

Logger.debug = function(message){
  if(typeof linkstartJsLogLevel !== 'undefined' && linkstartJsLogLevel==="debug"){
    if(typeof message === 'object'){
      console.log(JSON.stringify(message, null, 4));
    }else{
      console.log(message);
    }
  }
}

Logger.info = function(message){
  if(typeof message === 'object'){
    console.log(JSON.stringify(message, null, 4));
  }else{
    console.log(message);
  }
}

module.exports = Logger;
