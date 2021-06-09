require('nodejs-require-enhancer');
const webpack = require('webpack')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const config = require('org/linkstartjs/webpack/config/WebpackProdConfig.js');
const Logger = require("org/linkstartjs/logger/Logger.js")
const util = require('util');
const compiler = webpack(config);
const webpackCompilerRunPromise = util.promisify(compiler.run);
const rimrafPromise = util.promisify(rimraf);
const fsStatPromise = util.promisify(fs.stat);
const fsAccessPromise = util.promisify(fs.access);
const fsReaddirPromise = util.promisify(fs.readdir);

function WebpackBuild() {

  this.run = () => {
    return new Promise((resolve, reject) => {
      this.clean(LinkStartPaths.build).then(function() {
        compiler.run(function(err, stats) {
          if (err) {
            Logger.info("Webpack compiler encountered a fatal error");
            Logger.info(err);
            return reject();
          }
          if (stats.hasErrors()) {
            Logger.info("Webpack compiler encountered a fatal error");
            Logger.info(stats.compilation.errors);
            Logger.info(stats.toJson());
            return reject()
          }
          
          const jsonStats = stats.toJson()
          Logger.debug(jsonStats);
          Logger.info(`Webpack compilation completed successfully. Build folder ${LinkStartPaths.build}.`)

          fs.readdir(LinkStartPaths.build, (err, files) => {
            files.forEach(file => {
              Logger.info("- " + file);
            });
            resolve();
          });

        });
      })
    });
  }

  this.clean = (dir) => {
    return new Promise(function(resolve, reject) {
      fs.access(dir, function(error) {
        if (error) {
          resolve();
        } else {
          rimraf(dir, function() {
            resolve();
          });
        }
      })
    });
  }

}

module.exports = WebpackBuild
