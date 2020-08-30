const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  devServer: {
    inline: true,
    hot: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: LinkStartPaths.src,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        options: {
          configFile: LinkStartPaths.home+'/.eslintrc',
          emitWarning: true
        }
      },
      {
        test: /\.html$/i,
        loader: require.resolve('html-loader'),
      },
      {
        test: /\.js$/,
        include: LinkStartPaths.src,
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.js$/,
        include: LinkStartPaths.src,
        loader: LinkStartPaths.home+'/src/org/linkstartjs/webpack/loader/linkstartjs-loader.js',
          options: {
            srcLocation: LinkStartPaths.src,
            logLevel:"debug"
          }
      },
      {
        test: /\.s?css$/i,
        use: [require.resolve('style-loader'), require.resolve('css-loader')+'?sourceMap=true', require.resolve('sass-loader')]
      }
    ]
  }
});
