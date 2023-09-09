const path = require('path');
const { defineConfig } = require('cypress');

const { devServer } = require('./webpack.config');

module.exports = defineConfig({
  downloadsFolder: path.join(__dirname, '../temp'),
  screenshotsFolder: path.join(__dirname, '../temp'),
  videosFolder: path.join(__dirname, '../temp'),
  trashAssetsBeforeRuns: false,
  e2e: {
    baseUrl: `http://localhost:${devServer.port}`,
    specPattern: 'e2e/**/*.js',
    supportFile: 'utils/e2e-support.js',
  },
});
