const Webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./WebpackCommonConfig.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js'
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
          { loader: LinkStartPaths.home+'/src/main/org/linkstartjs/webpack/loader/LinkstartjsLoader.js',
            options: {
              srcLocation: LinkStartPaths.src,
              linkstartJsLogLevel:process.env.LINK_START_LOG_LEVEL  || "info" ,
              metaJsLogLevel: process.env.META_JS_LOG_LEVEL ||  "info"
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
