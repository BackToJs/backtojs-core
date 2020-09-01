const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const appPath = process.cwd();

global.LinkStartPaths = {
  app: appPath, // source files
  src: appPath + '/src', // source files
  build: appPath + '/dist', // production build files
  public: appPath + '/src/public', // static files to copy to build folder
  home: path.resolve(__dirname, '..', '..', '..', '..', '..') // production build files
}

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
    new CopyWebpackPlugin({ patterns: [{ from: LinkStartPaths.public, to: 'public' }] }),
    new HtmlWebpackPlugin({
      favicon: LinkStartPaths.src + '/images/favicon.png',
      template: LinkStartPaths.src + '/index.html' // template file
    }),
  ],
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
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
};
