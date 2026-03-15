/**
 * @file Create record Mardown file from fields
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import Config from '../core/models/config.js';
import Record from '../core/models/record.js';

/**
 * Format data, prompt warnings and create record file
 * @param {string} title
 * @param {string} typeString
 * @param {string} tagsString
 * @param {Config} config
 * @param {boolean} saveIdOnYmlFrontMatter
 */

function createRecord(
  title,
  typeString = 'undefined',
  tagsString = '',
  config,
  saveIdOnYmlFrontMatter = true,
) {
  if (config instanceof Config === false) {
    throw new Error('Need instance of Config to create record');
  }

  const trimmedType = typeString.trim();
  const trimmedTags = tagsString.trim();

  let types = [];
  let tags = [];

  if (trimmedType !== '') {
    types = trimmedType
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
  }
  if (trimmedTags !== '') {
    tags = trimmedTags
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
  }

  const knownTypes = config.getTypesRecords();
  const unknownTypes = types.filter((t) => !knownTypes.has(t));

  if (unknownTypes.length > 0) {
    console.log(
      ['\x1b[33m', 'Warn.', '\x1b[0m'].join(''),
      unknownTypes.length === 1
        ? `type "${unknownTypes[0]}" is`
        : `types "${unknownTypes.join('","')}" are`,
      `not set in the configuration, will treat as "undefined"`,
    );
  }

  const record = Record.recordWithTimestamp(
    {
      title,
      types,
      tags,
    },
    config,
  );

  const fileName = record.getFileName();
  const filePath = path.join(config.opts['files_origin'], fileName);

  const save = () =>
    fs.writeFile(filePath, record.getFileContent(saveIdOnYmlFrontMatter), (_err) => {
      logRecordIsSaved();
    });

  if (fs.existsSync(filePath)) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`Do you want to overwrite '${fileName}' ? (y/n) `, async (answer) => {
      if (answer === 'y') {
        try {
          save();
        } catch (err) {
          console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), err.message);
        }
      }
      rl.close();
    });
    return;
  }

  save();

  function logRecordIsSaved() {
    const { dir: fileDir, base: recordFileName } = path.parse(filePath);
    console.log(
      ['\x1b[32m', 'Record created', '\x1b[0m'].join(''),
      `: ${['\x1b[2m', fileDir, '/', '\x1b[0m', recordFileName].join('')}`,
    );
  }
}

export default createRecord;
