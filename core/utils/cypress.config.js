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
    specPattern: '**/*cy.js',
    supportFile: path.join(__dirname, './e2e-support.js'),
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
