const path = require('path');
const fs = require('fs');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const WebpackUtil = require('../util/WebpackUtil.js');
const Logger = require("../../logger/Logger.js")
const webpack = require('webpack');

var jsEntrypointAbsoluteLocation = path.join(LinkStartPaths.src ,"main", "/index.js");
var options = WebpackUtil.getLinkStartOptionsFromFilePath(jsEntrypointAbsoluteLocation)
Logger.info("LinkStart Options:");
Logger.info(options);

var dynamicPugins = WebpackUtil.createMergeIntoSingleFilePlugin(options, LinkStartPaths.src, LinkStartPaths.workspace);

Logger.info("\nLinkStart Paths:");
Logger.info(LinkStartPaths);

module.exports = {
    entry: {
        app: jsEntrypointAbsoluteLocation
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
                from: path.join(LinkStartPaths.src ,"main"),
                globOptions: {
                    ignore: [
                        '/**/settings.json',
                        '/**/index.html',
                        '/**/index.js',
                        '/**/handlers',
                        '/**/styles',
                        '/**/pages'
                    ]
                }
            }]
        }),       
        new HtmlWebpackPlugin({
            favicon: LinkStartPaths.faviconFile,
            template: path.join(LinkStartPaths.src ,"main", options.templateName || 'index.html')
        })        
    ].concat(dynamicPugins),
    resolve: {
        alias: {
            '~': path.join(LinkStartPaths.src ,"main")
        },
    },
    watch: true,
    module: {
        rules: [

            {
                test: /\.(js)$/,
                exclude: [/node_modules/],
                use: [{
                    loader: require.resolve('eslint-loader'),
                    options: {
                        configFile: LinkStartPaths.home + '/.eslintrc',
                        emitWarning: true
                    }
                }, {
                    loader: require.resolve('babel-loader'),
                    options: {
                        configFile: LinkStartPaths.home + '/.babelrc'
                    }
                }, {
                    loader: require.resolve('eslint-loader'),
                    options: {
                        configFile: LinkStartPaths.home + '/.eslintrc'
                    }
                }, {
                    loader: LinkStartPaths.home + '/src/main/org/linkstartjs/webpack/loader/LinkstartjsLoader.js',
                    options: {
                        srcLocation: LinkStartPaths.src,
                        LinkStartHomeLocation: LinkStartPaths.home,
                        linkstartJsLogLevel: process.env.LINK_START_LOG_LEVEL || "info",
                        metaJsLogLevel: process.env.META_JS_LOG_LEVEL || "info"
                    }
                }],
            }, {
                test: /\.html$/i,
                loader: require.resolve('html-loader'),
            }, {
                test: /\.s?css$/i,
                use: [require.resolve('style-loader'), require.resolve('css-loader') + '?sourceMap=true', require.resolve('sass-loader')]
            }, {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            }, {
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