const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");

const entries = [__dirname + "/src/main/DefaultSpaIndex.js"];
const customCssPath = process.cwd() + "/src/css/style.css";
if (fs.existsSync(customCssPath)) {
  entries.push(customCssPath);
}

const envObj = Object.keys(process.env)
  .filter(key => key.startsWith('BACK2JS_'))
  .reduce((env, key) => {
    const newKey = key.replace(/^BACK2JS_/, '');
    env[newKey] = process.env[key];
    return env;
  }, {
    NODE_ENV: process.env.NODE_ENV || 'production'
  });

const envKeys = {
  'process.env': JSON.stringify(envObj)
};

module.exports = {
  mode: process.env.NODE_ENV,
  entry: entries,
  output: {
    filename: "bundle.js",
    path: process.cwd() + "/build",
    publicPath: "./"
  },
  module: {
    rules: [{
      test: /\.html$/i,
      loader: "html-loader",
    },
    {
      test: /\.js$/,
      use: [
        "babel-loader",
        require.resolve(__dirname + "/src/main/loaders/controller-loader.js")
      ],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'images/[name][ext]'
      }
    },
    {
      test: /\.(mp3|wav|ogg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'sounds/[name][ext]'
      }
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.DefinePlugin(envKeys),
  ],
  resolve: {
    modules: [
      process.cwd() + '/src',
      'node_modules'
    ],
    fallback: {
      "fs": false
    },
    alias: {
      ejs_components: __dirname + '/node_modules/ejs'
    }
  }
};
