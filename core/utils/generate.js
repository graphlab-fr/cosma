const fs = require('fs'),
  path = require('path'),
  { faker } = require('@faker-js/faker');
const { downloadFile, getTimestamp } = require('./misc');

const tempDirPath = path.join(__dirname, '../temp');
if (fs.existsSync(tempDirPath) === false) {
  fs.mkdirSync(tempDirPath);
}

/**
 * @param {array[]} files
 * @returns {Promise}
 */

function fetchFiles(files) {
  return new Promise(async (resolve, reject) => {
    try {
      for (const [url, fileName] of files) {
        const filePath = path.join(tempDirPath, fileName);
        if (fs.existsSync(filePath)) {
          continue;
        }
        await downloadFile(url, filePath);
      }
      resolve(files);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @returns {Promise}
 */

function fetchBibliographyFiles() {
  return fetchFiles([
    ['https://www.zotero.org/styles/iso690-author-date-fr-no-abstract', 'iso690.csl'],
    [
      'https://raw.githubusercontent.com/citation-style-language/locales/6b0cb4689127a69852f48608b6d1a879900f418b/locales-fr-FR.xml',
      'locales-fr-FR.xml',
    ],
  ]);
}

/**
 * @returns {Promise}
 */

function fetchSpreadsheets() {
  return fetchFiles([
    [
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGoL9aa7d-VR5ZNT3uGignX1FgZI2GwjM7tUjJhe4ipWjsDutALN5jcuQ_QthHvnueQ1jG5vqoxKS-/pub?gid=0&single=true&output=csv',
      'nodes.csv',
    ],
    [
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGoL9aa7d-VR5ZNT3uGignX1FgZI2GwjM7tUjJhe4ipWjsDutALN5jcuQ_QthHvnueQ1jG5vqoxKS-/pub?gid=1233026049&single=true&output=csv',
      'links.csv',
    ],
  ]);
}

/**
 * @param {string[]} imageNames
 * @returns {Promise}
 */

function fetchFakeImages(imageNames) {
  return new Promise(async (resolve, reject) => {
    try {
      for (const imageName of imageNames) {
        const imagePath = path.join(tempDirPath, imageName);
        const url = faker.image.city();
        if (fs.existsSync(imagePath)) {
          continue;
        }
        await downloadFile(url, imagePath);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @param {string[]} thumbnailNames
 * @returns {Promise}
 */

function fetchFakeThumbnails(thumbnailNames) {
  return new Promise(async (resolve, reject) => {
    try {
      for (const thumbnailName of thumbnailNames) {
        const imagePath = path.join(tempDirPath, thumbnailName);
        const url = faker.internet.avatar();
        if (fs.existsSync(imagePath)) {
          continue;
        }
        await downloadFile(url, imagePath);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function cosmocope(savePath, templateOptions = ['publish', 'css_custom', 'citeproc', 'dev']) {
  const Cosmoscope = require('../models/cosmoscope'),
    Template = require('../models/template');
  const {
    config: fakeConfig,
    getRecords,
    nodeThumbnails,
    images: recordImages,
  } = require('./fake');
  return new Promise(async (resolve, reject) => {
    Promise.all([
      fetchBibliographyFiles(),
      fetchFakeImages(recordImages),
      fetchFakeThumbnails(nodeThumbnails),
    ])
      .then(() => {
        const records = getRecords(20);

        const graph = new Cosmoscope(records, fakeConfig.opts, ['fake']),
          { html } = new Template(graph, templateOptions);

        savePath = path.join(savePath, 'index.html');

        fs.writeFile(savePath, html, (err) => {
          if (err) {
            reject(err);
          }
          resolve({
            nbRecords: graph.records.length,
            graph,
            savePath,
          });
        });
      })
      .catch(reject);
  });
}

function cosmocopeTimeline() {
  const Cosmoscope = require('../models/cosmoscope'),
    Template = require('../models/template');

  const { config: fakeConfig, getRecords } = require('./fake');

  const fakeRecords = getRecords(5);

  const records = [
    { ...fakeRecords[0], begin: getTimestamp('01-01-2020'), end: undefined },
    { ...fakeRecords[1], begin: getTimestamp('01-01-2021'), end: getTimestamp('01-01-2024') },
    { ...fakeRecords[2], begin: getTimestamp('01-01-2022'), end: undefined },
    { ...fakeRecords[3], begin: getTimestamp('01-01-2023'), end: undefined },
    { ...fakeRecords[4], begin: getTimestamp('01-01-2025'), end: undefined },
  ];

  return new Promise(async (resolve, reject) => {
    const graph = new Cosmoscope(records, fakeConfig.opts),
      { html } = new Template(graph, ['publish', 'dev']);

    const savePath = path.join(tempDirPath, 'cosmocopeTimeline.html');

    fs.writeFile(savePath, html, (err) => {
      if (err) {
        reject(err);
      }
      resolve({
        nbRecords: graph.records.length,
        graph,
        savePath,
      });
    });
  });
}

module.exports = {
  cosmocope,
  cosmocopeTimeline,
  fetchBibliographyFiles,
  fetchFakeImages,
  fetchFakeThumbnails,
  fetchSpreadsheets,
  tempDirPath,
};
