const WebpackUtil = require('../webpack/util/WebpackUtil.js');
const path = require('path');

function LinkStartUtil() {

    this.configureGlobalLocations = function() {
        var appPath = process.env.LINKS_START_APP_PATH || process.cwd();
        global.LinkStartPaths = {
            src: appPath + '/src', // source files
            build: appPath + '/dist', // production build files
            home: path.resolve(__dirname, '..', '..', '..', '..', '..') // linkstart home
        }
        
        //use this https://stackoverflow.com/a/54523021/3957754 to add head or body chunks

        var faviconFile = WebpackUtil.smartUniqueFileLocator(LinkStartPaths.src, "favicon.ico");
        if (faviconFile != null && typeof faviconFile !== 'undefined') {
            LinkStartPaths.faviconFile = faviconFile;
        } else {
            LinkStartPaths.faviconFile = LinkStartPaths.home + "/src/main/resources/images/favicon.ico";
        }
    }

}

module.exports = LinkStartUtil