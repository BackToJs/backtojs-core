const Webpack = require('webpack');
const chokidar = require("chokidar");
const fs = require('fs-extra');
const path = require('path');
const EnvSettings = require("advanced-settings").EnvSettings;
const envSettings = new EnvSettings();

module.exports = {
    liveReload: true,
    hot: true,
    historyApiFallback: true ,
    port: process.env.PORT || 2501,
    setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
            throw new Error('webpack-dev-server is not defined');
        }

        devServer.app.get('/settings.json', async function(req, res) {
            try {
                settings = await envSettings.loadJsonFile(
                    path.join(LinkStartPaths.src, "main","settings.json"), 'utf8');
                res.json(settings);
            } catch (err) {
                console.log(err)
                res.json({code:500});
            }
        });

        var jsEntrypointAbsoluteLocation = path.join(LinkStartPaths.src, "main", "index.js");

        chokidar.watch([
            LinkStartPaths.src + '/main/**/*.*'
        ]).on('all', async function(event, filename) {
            if (devServer.compiler.idle === true &&
                filename != jsEntrypointAbsoluteLocation) {
                console.log("content changed: " + filename)
                console.log("compiler.running: " + devServer.compiler.running)
                console.log("compiler.idle: " + devServer.compiler.idle)
                await fs.ensureFile(jsEntrypointAbsoluteLocation)
                const now = new Date()
                await fs.utimes(jsEntrypointAbsoluteLocation, now, now);
            }
        })

        return middlewares;
    },
}