const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../frontend/index.js'),
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../temp'),
    },
    port: 9000,
  },
  mode: 'production',
};
