const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: require.resolve('eslint-loader'),
            options: {
              configFile: LinkStartPaths.home+'/.eslintrc',
              emitWarning: true
            }
          },
          { loader: require.resolve('babel-loader'),
            options: {
              configFile: LinkStartPaths.home+'/.babelrc'
            }
          },
          { loader: require.resolve('eslint-loader'),
            options: {
              configFile: LinkStartPaths.home+'/.eslintrc'
            }
          },
          { loader: LinkStartPaths.home+'/src/org/linkstartjs/webpack/loader/linkstartjs-loader.js',
            options: {
              srcLocation: LinkStartPaths.src,
              linkstartJsLogLevel:"info" || process.env.LINK_START_LOG_LEVEL,
              metaJsLogLevel:"info" || process.env.META_JS_LOG_LEVEL
            }
          }
        ],
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')],
      },
    ],
  },
});
