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
  watch: true,
  devServer: {
    static: {
      directory: path.join(__dirname, '..'),
    },
    port: 9000,
    open: ['./temp/cosmoscope.html'],
  },
  mode: 'production',
};
