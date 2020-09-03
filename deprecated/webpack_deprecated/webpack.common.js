const paths = require('./paths')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
  /**
   * Entry
   *
   * The first place Webpack looks to start building the bundle.
   */
  entry: [paths.src + '/index.js'],

  /**
   * Output
   *
   * Where Webpack outputs the assets and bundles.
   */
  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  /**
   * Plugins
   *
   * Customize the Webpack build process.
   */
  plugins: [
    /**
     * CleanWebpackPlugin
     *
     * Removes/cleans build folders and unused assets when rebuilding.
     */
    new CleanWebpackPlugin(),

    /**
     * CopyWebpackPlugin
     *
     * Copies files from target to destination folder.
     */
    // new CopyWebpackPlugin([
    //   {
    //     from: paths.static,
    //     to: 'assets',
    //     ignore: ['*.DS_Store'],
    //   },
    // ]),

    /**
     * HtmlWebpackPlugin
     *
     * Generates an HTML file from a template.
     */
    new HtmlWebpackPlugin({
      title: 'Webpack Boilerplate',
      favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/index.html', // template file
      filename: 'index.html', // output file
    }),
  ],

  /**
   * Module
   *
   * Determine how modules within the project are treated.
   */
  module: {
    rules: [
      /**
       * JavaScript
       *
       * Use Babel to transpile JavaScript files.
       */
      {
        test: /\.(js|html)$/,
        exclude: [/node_modules/, /index\.html$/],
        use: [
          { loader: require.resolve('babel-loader'),
            options: {
              configFile: paths.linkStartJsHomePath+'/.babelrc'
            }
          },
          { loader: require.resolve('eslint-loader'),
            options: {
              configFile: paths.linkStartJsHomePath+'/.eslintrc'
            }
          },
          { loader: paths.linkStartJsHomePath+'/src/org/linkstartjs/webpack/loader/linkstartjs-loader.js',
            options: {
              srcLocation: paths.src,
              logLevel:"debug"
            }
          }
        ],
      },
      /**
       * Styles
       *
       * Inject CSS into the head with source maps.
       */
      {
        test: /\.(scss|css)$/,
        use: [
          require.resolve('style-loader'),
          { loader: require.resolve('css-loader'), options: { sourceMap: true, importLoaders: 1 } },
          { loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-preset-env')({ //replacement of postcss.config.js
                  browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ]
                }),
                require('cssnano')()
              ]
            }
          },
          { loader: require.resolve('sass-loader'), options: { sourceMap: true } },
        ],
      },

      /**
       * Images
       *
       * Copy image files to build folder.
       */
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      },

      /**
       * Fonts
       *
       * Inline font files.
       */
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 8192,
          name: '[path][name].[ext]',
          context: 'src', // prevent display of src/ in filename
        },
      }
      ,
      {
        test: /\.html$/i,
        loader: require.resolve('underscore-template-loader'),
      }
    ],
  },
}
