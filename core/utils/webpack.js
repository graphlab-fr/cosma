import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config.js';

/**
 * @returns {Promise<webpack.StatsCompilation>}
 */

export function execute(mode) {
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
}

export function startServer(mode) {
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
}
