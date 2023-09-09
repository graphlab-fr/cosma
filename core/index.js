const { cosmocope, cosmocopeTimeline, tempDirPath } = require('./utils/generate');

const { startServer: webpackServer } = require('./utils/webpack');

(async () => {
  try {
    console.log('Download some files...');
    await cosmocope(tempDirPath);
    await cosmocopeTimeline();
    console.log('Start devserver...');
    await webpackServer('development');
  } catch (err) {
    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
  }
})();
