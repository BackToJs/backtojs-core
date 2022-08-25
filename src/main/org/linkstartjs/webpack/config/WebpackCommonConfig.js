const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const WebpackUtil = require('../util/WebpackUtil.js');
const appPath = process.env.LINKS_START_APP_PATH || process.cwd();
const Logger = require("../../logger/Logger.js")

global.LinkStartPaths = {
  src: appPath + '/src', // source files
  build: appPath + '/dist', // production build files
  home: path.resolve(__dirname, '..', '..', '..', '..', '..', '..') // linkstart home
}

var options = WebpackUtil.getLinkStartOptionsFromFilePath(LinkStartPaths.src + '/index.js')
Logger.info("LinkStart Options:");
Logger.info(options);

var dynamicPugins = WebpackUtil.createMergeIntoSingleFilePlugin(options, LinkStartPaths.src);
//use this https://stackoverflow.com/a/54523021/3957754 to add head or body chunks

var faviconFile = WebpackUtil.smartUniqueFileLocator(LinkStartPaths.src,"favicon.ico");
if(faviconFile!=null && typeof faviconFile !== 'undefined'){
  LinkStartPaths.faviconFile = faviconFile;
}else{
  LinkStartPaths.faviconFile = LinkStartPaths.home+"/src/main/resources/images/favicon.ico";
}

Logger.info("\nLinkStart Paths:");
Logger.info(LinkStartPaths);

module.exports = {
  entry: {
    app: LinkStartPaths.src + '/index.js',
  },
  output: {
    path: LinkStartPaths.build,
    filename: 'js/[name].js',
  },
  optimization: {
    minimize: options.webpackMinimize === undefined ? true : false,
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
        patterns: [{
            from: LinkStartPaths.src,
            globOptions: {
                ignore: [
                    '/**/index.html',
                    '/**/index.js',
                    '/**/actions',
                    '/**/styles',
                    '/**/pages'
                ]
            }
        }]
    }),
    new HtmlWebpackPlugin({
      favicon: LinkStartPaths.faviconFile,
      template: LinkStartPaths.src + '/index.html' // template file
    })
  ].concat(dynamicPugins),
  resolve: {
    alias: {
      '~': LinkStartPaths.src
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
};
