/**
 * @file Create several records from a JSON data file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import { parse } from 'csv-parse/sync';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import Record from '../core/models/record.js';
import Config from '../core/models/config.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import isTimestampIncrement from '../core/utils/isTimestampIncrement.js';
import timestampIncrement from '../core/utils/timestampIncrement.js';

async function batch(filePath, saveIdOnYmlFrontMatter) {
  const config = Config.get(Config.configFilePath);
  console.log(config.getConfigConsolMessage());

  if (config.opts['generate_id'] === 'never') {
    saveIdOnYmlFrontMatter = false;
  } else {
    saveIdOnYmlFrontMatter = config.opts['generate_id'] === 'always' || !!saveIdOnYmlFrontMatter;
  }

  if (fs.existsSync(filePath) === false) {
    return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Data file does not exist.');
  }

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  const todayMaxTimestamp = timestampIncrement(0);
  const timestamps = [todayMaxTimestamp];

  await Promise.all(
    files.map(async (filePath) => {
      const content = await fsPromises.readFile(filePath, 'utf8');
      const record = Record.recordFromFile(content, config);
      if (isTimestampIncrement(record.id)) {
        timestamps.push(record.id);
      }
    }),
  );
  timestamps.sort((a, b) => Number(b) - Number(a));

  const heigtherTimestamp = timestamps[0];
  const increment = heigtherTimestamp - todayMaxTimestamp + 1;

  /** @type {Record[]} */
  let records = [];

  fs.readFile(filePath, 'utf-8', async (err, data) => {
    if (err) {
      return console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot read data file.');
    }

    switch (path.extname(filePath)) {
      case '.json':
        try {
          data = JSON.parse(data);
        } catch (error) {
          return console.error(
            ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
            'JSON data file is invalid.',
          );
        }
        break;

      case '.csv':
        try {
          data = parse(data, {
            columns: true,
            skip_empty_lines: true,
            cast: (value) => (value === '' ? undefined : value),
          });
        } catch (error) {
          return console.error(
            ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
            'CSV data file is invalid.',
          );
        }
        break;

      default:
        return console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Data file format unrecognized. Supported file extensions: .json, .csv.',
        );
    }

    if (!Array.isArray(data)) {
      throw new Error('Batch data should be array');
    }

    records = data.map((e, i) => Record.recordWithIncrementedTimestamp(e, config, increment + i));

    await Promise.all(
      records.map(async (record) => {
        const filePath = path.join(config.opts['files_origin'], record.getFileName());
        if (fs.existsSync(filePath)) {
          throw new Error(`File ${filePath} already exist`);
        }

        await fsPromises.writeFile(filePath, record.getFileContent(saveIdOnYmlFrontMatter));
      }),
    );

    console.log(
      ['\x1b[32m', 'Records created', '\x1b[0m'].join(''),
      `(${records.length})`,
      ['\x1b[2m', config.opts['files_origin'], '\x1b[0m'].join(''),
    );
  });
}

export default batch;
