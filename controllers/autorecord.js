/**
 * @file Prompt config to create record
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const Config = require('../core/models/config');

const createRecord = require('./create-record');

/**
 * Prompt config and pass record data
 * @param {string} title
 * @param {string} type
 * @param {string} tags
 */

module.exports = function (title = '', type = 'undefined', tags = '') {
  const config = Config.get(Config.configFilePath);

  console.log(config.getConfigConsolMessage());

  if (config.canSaveRecords() === false) {
    console.error(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'Unable to create record: missing value for files_origin in the configuration file',
    );
    return;
  }

  createRecord(title, type, tags, config);
};
