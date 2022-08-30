const express = require('express');
const SpaServer = require('nodeboot-spa-server').SpaServer;
const app = express();

function LinkstartSpaServer() {

    const allowedExt = [
        '.js',
        '.ico',
        '.css',
        '.png',
        '.jpg',
        '.woff2',
        '.woff',
        '.ttf',
        '.svg',
        '.jpeg',
        '.json',
        '.webmanifest'
    ];

    this.run = async function(staticFolderName, settingsPath, allowedRoutes) {
        var port = process.env.PORT || 2104;
        await SpaServer(app, allowedExt, port, allowedRoutes, staticFolderName, settingsPath);
    }

}

module.exports = LinkstartSpaServer