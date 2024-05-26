/**
 * @file Prompt config to create record
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import Config from '../core/models/config.js';
import makeRecord from './record.js';

/**
 * Prompt config and pass record data
 * @param {string} title
 * @param {string} type
 * @param {string} tags
 */

function autorecord(title = '', type = 'undefined', tags = '', saveIdOnYmlFrontMatter) {
  const config = Config.get(Config.configFilePath);

  console.log(config.getConfigConsolMessage());

  if (config.canSaveRecords() === false) {
    console.error(
      ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
      'Unable to create record: missing value for files_origin in the configuration file',
    );
    return;
  }

  if (config.opts['generate_id'] === 'never') {
    saveIdOnYmlFrontMatter = false;
  } else {
    saveIdOnYmlFrontMatter = config.opts['generate_id'] === 'always' || !!saveIdOnYmlFrontMatter;
  }

  makeRecord(title, type, tags, config, saveIdOnYmlFrontMatter);
}

export default autorecord;
