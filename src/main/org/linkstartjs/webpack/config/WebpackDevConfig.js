const Webpack = require('webpack');
const chokidar = require("chokidar");
const fs = require('fs-extra');
const path = require('path');
const EnvSettings = require('advanced-settings').EnvSettings;
const envSettings = new EnvSettings();

module.exports = {
    liveReload: true,
    hot: true,
    port: 8080,
    setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
            throw new Error('webpack-dev-server is not defined');
        }

        devServer.app.get('/settings.json', async function(req, res) {
            try {
                settings = await envSettings.loadJsonFile(
                    path.join(LinkStartPaths.src, "settings.json"), 'utf8');
                res.json(settings);
            } catch (err) {
                console.log(err)
                res.json({code:500});
            }
        });

        chokidar.watch([
            LinkStartPaths.src + '/**/*.*'
        ]).on('all', async function(event, filename) {
            if (devServer.compiler.idle === true &&
                filename != path.join(LinkStartPaths.src, "index.js")) {
                console.log("content changed: " + filename)
                console.log("compiler.running: " + devServer.compiler.running)
                console.log("compiler.idle: " + devServer.compiler.idle)
                await fs.ensureFile(path.join(LinkStartPaths.src, "index.js"))
                const now = new Date()
                await fs.utimes(path.join(LinkStartPaths.src, "index.js"), now, now);
            }
        })

        return middlewares;
    },
}