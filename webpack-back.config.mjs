import webpack from 'webpack';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: path.resolve(__dirname, './app.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'back.cjs',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.njk$/,
        type: 'asset/source',
      },
      {
        test: /\.raw.js$/,
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
      {
        test: /\.png$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^fsevents$/,
    }),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {

      front: path.resolve(__dirname, './dist/front.raw.js'), // Chemin vers le bundle front
    },
  },
  mode: 'development',
};
