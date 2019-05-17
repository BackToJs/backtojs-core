const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["./src/index.js"],
  devtool: "#inline-source-map",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
    publicPath: "/"
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
         test: /\.css$/,
         loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      title: 'Hello World app'
    })
  ]
};
