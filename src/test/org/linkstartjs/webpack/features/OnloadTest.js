require('nodejs-require-enhancer');
const Assert = require('assert-js')

function DefaultRouteTest() {

  this.getRoute = function(){
    return "#onLoadAction";
  }

  this.test = function(htmlBody){
    console.log(htmlBody);
  }

}

module.exports = DefaultRouteTest
