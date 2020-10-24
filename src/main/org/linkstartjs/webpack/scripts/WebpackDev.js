const include = require('nodejs-require-enhancer');
const supervisor = require('supervisor');
const Logger = include("org/linkstartjs/logger/Logger.js")

function WebpackDev () {

  this.run = function() {
    Logger.info("LinkStart.js dev mode is starting...");
    supervisor.run(["-e", 'js|html|css', __dirname+"/ReloadableServer.js"]);
  }

}

module.exports = WebpackDev
