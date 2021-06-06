require('nodejs-require-enhancer');
const webpack = require('webpack')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const config = require('org/linkstartjs/webpack/config/WebpackProdConfig.js');
const Logger = require("org/linkstartjs/logger/Logger.js")

function WebpackBuild() {

  this.run = function(callback) {
    Logger.info("LinkStart build mode is starting...");

    const compiler = webpack(config)
    this.clean(LinkStartPaths.build).then(() => {
      compiler.run((err, stats) => {

        if (err) {
          this.throwNewError(err,new Error("Webpack compiler encountered a fatal error"));
        }

        if (stats.hasErrors()) {
          this.throwNewError(new Error(stats.compilation.errors),new Error("Webpack compiler encountered a fatal error"));
        }

        const jsonStats = stats.toJson()
        Logger.debug(jsonStats);
        Logger.info(`Webpack compilation completed successfully. Build folder ${LinkStartPaths.build}. Build content:`)

        fs.readdir(LinkStartPaths.build, (err, files) => {
          files.forEach(file => {
            Logger.info("- "+file);
          });
          if(callback){
            return callback();
          }
        });
      })
    })
  }

  this.clean = function(dir) {

    return new Promise((resolve) => {

      fs.stat(dir, (fsErr, stats) => {

        if (fsErr) {
          return resolve()
        }

        rimraf(dir, (delErr) => {

          if (delErr) {
            console.log('Error deleting ' + dir)
            console.log(delErr)
          }
          resolve()
        })
      })
    })
  }

  this.throwNewError = function(previousError, newError) {
    newError.original = previousError
    newError.stack = newError.stack.split('\n').slice(0,2).join('\n') + '\n' +previousError.stack
    throw newError
  }



}

module.exports = WebpackBuild
