import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: path.resolve(__dirname, './core/frontend/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'front.js',
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
      directory: path.join(__dirname, './temp'),
    },
    port: 9000,
  },
  mode: 'development',
};
