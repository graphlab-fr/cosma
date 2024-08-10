import { cosmocope, cosmocopeTimeline, cosmocopeTitleId, tempDirPath } from './utils/generate.js';
import { startServer as webpackServer } from './utils/webpack.js';

(async () => {
  try {
    console.log('Download some files...');
    await cosmocope(tempDirPath);
    // await cosmocopeTimeline();
    // await cosmocopeTitleId();
    console.log('Start devserver...');
    await webpackServer('development');
  } catch (err) {
    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err);
  }
})();
