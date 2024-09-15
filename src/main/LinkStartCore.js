const Logger = require("./org/linkstartjs/logger/Logger.js")
const LinkStartUtil = require("./org/linkstartjs/util/LinkStartUtil.js")

function LinkStartCore() {

    this.start = async () => {
        var args;
        if (typeof process.env.LINKSTART_OVERRIDE_ARGV !== 'undefined') {
            args = [process.env.LINKSTART_OVERRIDE_ARGV]
        } else {
            args = process.argv.slice(2);
        }

        var linkStartUtil = new LinkStartUtil();
        linkStartUtil.configureGlobalLocations();

        if (args[0] === 'dev') {
            process.env.NODE_ENV = 'development'
            const WebpackDev = require('./org/linkstartjs/webpack/scripts/WebpackDev.js')
            var webpackDev = new WebpackDev();
            webpackDev.run();
        } else if (args[0] === 'build') {
            process.env.NODE_ENV = 'production'
            const WebpackBuild = require('./org/linkstartjs/webpack/scripts/WebpackBuild.js')
            var webpackBuild = new WebpackBuild();
            await webpackBuild.run();
            Logger.info(`Build : completed`)
        } else if (args[0] === 'start') {
            process.env.NODE_ENV = 'production'
            const LinkstartSpaServer = require('./org/linkstartjs/webpack/scripts/LinkstartSpaServer.js')
            var linkstartSpaServer = new LinkstartSpaServer();
            linkstartSpaServer.run("dist", "src/main/settings.json", true).then(function () {
                Logger.info(`Start : completed`)
            });
        } else {
            console.log("LinkStart.js does not support this argument:" + args[0]);
        }
    };
}

module.exports = LinkStartCore;