var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './app/scripts/main.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: 'public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
