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
          { loader: LinkStartPaths.home+'/src/main/org/linkstartjs/webpack/loader/linkstartjs-loader.js',
            options: {
              srcLocation: LinkStartPaths.src,
              linkstartJsLogLevel:"info" || process.env.LINK_START_LOG_LEVEL,
              metaJsLogLevel:"info" || process.env.META_JS_LOG_LEVEL
            }
          }
        ],
      },
      {
        test: /\.html$/i,
        loader: require.resolve('html-loader'),
      },
      {
        test: /\.s?css$/i,
        use: [require.resolve('style-loader'), require.resolve('css-loader')+'?sourceMap=true', require.resolve('sass-loader')]
      }
    ]
  }
});
