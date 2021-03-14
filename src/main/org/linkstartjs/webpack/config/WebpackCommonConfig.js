require('nodejs-require-enhancer');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const WebpackUtil = require('org/linkstartjs/webpack/util/WebpackUtil.js');
const appPath = process.cwd();

global.LinkStartPaths = {
  src: appPath + '/src', // source files
  build: appPath + '/dist', // production build files
  public: appPath + '/src/public', // static files to copy to build folder
  home: path.resolve(__dirname, '..', '..', '..', '..', '..', '..') // linkstart home
}

var options = WebpackUtil.getLinkStartOptions(LinkStartPaths.src + '/index.js')
console.log("\nOptions:");
console.log(options);

var dynamicPugins = WebpackUtil.createMergeIntoSingleFilePlugin(options, LinkStartPaths.src);
//use this https://stackoverflow.com/a/54523021/3957754 to add head or body chunks

console.log("\nPaths:");
console.log(LinkStartPaths);
console.log("\n");

module.exports = {
  entry: {
    app: LinkStartPaths.src + '/index.js',
  },
  output: {
    path: LinkStartPaths.build,
    filename: 'js/[name].js',
  },
  optimization: {
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
                    '/**/index.js',
                    '/**/actions',
                    '/**/styles',
                    '/**/pages'
                ]
            }
        }]
    }),
    new HtmlWebpackPlugin({
      favicon: LinkStartPaths.src + '/images/favicon.png',
      template: LinkStartPaths.src + '/index.html' // template file
    })
  ].concat(dynamicPugins),
  resolve: {
    alias: {
      '~': LinkStartPaths.src,
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
