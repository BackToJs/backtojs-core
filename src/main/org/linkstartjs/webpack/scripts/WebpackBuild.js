require('nodejs-require-enhancer');
const webpack = require('webpack')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const config = require('../config/WebpackProdConfig.js');
const Logger = require("../../logger/Logger.js")
const util = require('util');
const compiler = webpack(config);

function WebpackBuild() {

  this.run = () => {
    return new Promise( async (resolve, reject) => {

      await this.clean(LinkStartPaths.build);
      Logger.info("Success clean")

      compiler.run(async function(err, stats) {
        Logger.info("Webpack compilation is starting...")
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
        Logger.info(`Webpack compilation completed successfully. Build folder ${LinkStartPaths.build}:`)

        var dirContent = await fs.promises.readdir(LinkStartPaths.build);
        dirContent.forEach(file => {
          Logger.info("- " + file);
        });        
        resolve();
      });
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
