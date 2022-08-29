const supervisor = require('supervisor');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Logger = require("../../logger/Logger.js")
const commonConfig = require('../config/WebpackCommonConfig.js');
const devConfig = require('../config/WebpackDevConfig.js');

function WebpackDev() {

    this.run = async function() {
        //Logger.info("LinkStart.js dev mode is starting...");
        //supervisor.run(["-e", 'js|html|css', __dirname + "/ReloadableServer.js"]);

        const compiler = webpack({...commonConfig,
            mode: 'development'
        });
        const server = new WebpackDevServer(devConfig, compiler);

        console.log('Starting dev server...');
        await server.start();



    }

}

module.exports = WebpackDev