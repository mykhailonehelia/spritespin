const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'web',
  output: {
    filename: 'spritespin.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }]
  }
};
