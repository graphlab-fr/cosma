/**
 * @file Create record Mardown file from fields
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import path from 'node:path';
import readline from 'node:readline';
import Config from '../core/models/config.js';
import Record from '../core/models/record.js';

/**
 * Format data, prompt warnings and create record file
 * @param {string} title
 * @param {string} type
 * @param {string} tags
 * @param {Config} config
 * @param {boolean} saveIdOnYmlFrontMatter
 */

function createRecord(
  title = '',
  type = 'undefined',
  tags = '',
  config,
  saveIdOnYmlFrontMatter = true,
) {
  if (config instanceof Config === false) {
    throw new Error('Need instance of Config to create record');
  }

  type = type.split(',').map((t) => t.trim());
  tags = tags.split(',').map((t) => t.trim());

  const knownTypes = config.getTypesRecords();
  const unknownTypes = [];
  for (const t of type) {
    if (knownTypes.has(t)) {
      continue;
    }
    config.opts.record_types = {
      // add unknown type to the config for generate file
      ...config.opts.record_types,
      [t]: config.opts.record_types.undefined,
    };
    unknownTypes.push(t);
  }
  if (unknownTypes.length > 0) {
    console.log(
      ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
      unknownTypes.length === 1
        ? `type "${unknownTypes[0]}" is`
        : `types "${unknownTypes.join('","')}" are`,
      `not set in the configuration, will treat as "undefined"`,
    );
  }

  const record = new Record(
    undefined,
    title,
    type,
    tags,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    config.opts,
  );
  if (saveIdOnYmlFrontMatter === false) {
    record.id = undefined;
    record.ymlFrontMatter = record.getYamlFrontMatter();
  }
  record
    .saveAsFile()
    .then(() => {
      logRecordIsSaved();
    })
    .catch((err) => {
      const { message, type } = err;
      switch (type) {
        case 'overwriting':
          rl = readline.createInterface({ input: process.stdin, output: process.stdout });
          rl.question(`Do you want to overwrite '${record.title}.md' ? (y/n) `, async (answer) => {
            if (answer === 'y') {
              try {
                await record.saveAsFile(true);
                logRecordIsSaved();
              } catch (err) {
                console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
              }
            }
            rl.close();
          });
          return;
        case 'no dir':
        case 'fs error':
        case 'report':
        default:
          console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), message);
          return;
      }
    });

  function logRecordIsSaved() {
    const { dir: fileDir, base: fileName } = path.parse(record.path);
    console.log(
      ['\x1b[32m', 'Record created', '\x1b[0m'].join(''),
      `: ${['\x1b[2m', fileDir, '/', '\x1b[0m', fileName].join('')}`,
    );
  }
}

export default createRecord;
