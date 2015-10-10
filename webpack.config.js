var webpack = require('webpack');

module.exports = {
  entry: './lib/lazyjson.js',
  output: {
    path: './dist',
    filename: 'lazyjson.js',
    library: 'LazyJSON',
    libraryTarget: 'umd'
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.optimize.DedupePlugin()
  ]
};
