const fs = require('fs'),
  path = require('path'),
  { faker } = require('@faker-js/faker');
const { downloadFile } = require('./misc');

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
  const { config: fakeConfig, records, nodeThumbnails, images: recordImages } = require('./fake');
  return new Promise(async (resolve, reject) => {
    Promise.all([
      fetchBibliographyFiles(),
      fetchFakeImages(recordImages),
      fetchFakeThumbnails(nodeThumbnails),
    ])
      .then(() => {
        const graph = new Cosmoscope(records, fakeConfig.opts, ['fake']),
          { html } = new Template(graph, templateOptions);

        savePath = path.join(savePath, 'cosmoscope.html');

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

function opensphere(savePath, templateOptions = ['publish', 'citeproc', 'dev']) {
  const Cosmoscope = require('../models/cosmoscope'),
    Record = require('../models/record'),
    Link = require('../models/link'),
    Template = require('../models/template');

  const { config: fakeConfig, nodeThumbnails } = require('./fake');
  return new Promise(async (resolve, reject) => {
    fetchSpreadsheets().then(() => {
      Cosmoscope.getFromPathCsv(
        path.join(tempDirPath, 'nodes.csv'),
        path.join(tempDirPath, 'links.csv'),
      )
        .then(([records, links]) => {
          links = Link.formatedDatasetToLinks(links);
          records = Record.formatedDatasetToRecords(records, links, fakeConfig);
          Promise.all([fetchBibliographyFiles(), fetchFakeThumbnails(nodeThumbnails)]).then(() => {
            const graph = new Cosmoscope(records, fakeConfig.opts),
              { html } = new Template(graph, templateOptions);

            savePath = path.join(savePath, 'otletosphere.html');
            fs.writeFile(savePath, html, (err) => {
              if (err) {
                reject(err);
              }
              resolve({
                nbRecords: graph.records.length,
                savePath,
              });
            });
          });
        })
        .catch(reject);
    });
  });
}

module.exports = {
  cosmocope,
  opensphere,
  fetchBibliographyFiles,
  fetchFakeImages,
  fetchFakeThumbnails,
  fetchSpreadsheets,
  tempDirPath,
};
