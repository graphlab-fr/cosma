const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

/**
 * @returns {Promise<webpack.StatsCompilation>}
 */

module.exports = {
  execute: function (mode) {
    const configWebpack = { ...webpackConfig, mode };

    return new Promise((resolve, reject) => {
      webpack(configWebpack, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (!stats) {
          return reject('Err. no infos');
        }

        const info = stats.toJson();
        if (stats.hasErrors()) {
          return reject(info.errors);
        }
        if (stats && stats.hasWarnings()) {
          return console.warn(info.warnings);
        }

        resolve(info);
      });
    });
  },
  startServer: function (mode) {
    return new Promise(async (resolve, reject) => {
      const compiler = await webpack({ ...webpackConfig, mode }),
        server = new webpackDevServer(webpackConfig.devServer, compiler);

      try {
        await server.start();
      } catch (error) {
        await server.stop();
        reject(error);
      }

      resolve(server);
    });
  },
};
