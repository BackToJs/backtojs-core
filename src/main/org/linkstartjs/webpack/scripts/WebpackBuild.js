const include = require('nodejs-require-enhancer');
const webpack = require('webpack')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const config = include('org/linkstartjs/webpack/config/webpack.prod.js');
const Logger = include("org/linkstartjs/logger/Logger.js")

function WebpackBuild() {

  this.run = function() {
    Logger.info("LinkStart.js build mode is starting...");

    const compiler = webpack(config)
    this.clean(LinkStartPaths.build).then(() => {
      compiler.run((err, stats) => {

        if (err) {
          console.log('Webpack compiler encountered a fatal error.', err)
          return reject(err)
        }

        const jsonStats = stats.toJson()
        console.log(jsonStats)
        console.log('Compilation completed successfully.')
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

}

module.exports = WebpackBuild
