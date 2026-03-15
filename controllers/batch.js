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
import formatAsRecord from '../core/utils/formatAsRecord.js';

async function batch(filePath, saveIdOnYmlFrontMatter) {
  const config = Config.get(Config.configFilePath);
  console.log(config.getConfigConsolMessage());

  let shouldSaveId;
  if (config.opts['generate_id'] === 'never') {
    shouldSaveId = false;
  } else {
    shouldSaveId = config.opts['generate_id'] === 'always' || Boolean(saveIdOnYmlFrontMatter);
  }

  if (fs.existsSync(filePath) === false) {
    console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Data file does not exist.');
    return;
  }

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  const todayMaxTimestamp = timestampIncrement(0);
  const timestamps = [todayMaxTimestamp];

  await Promise.all(
    files.map(async (mdFile) => {
      const content = await fsPromises.readFile(mdFile, 'utf8');
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

  fs.readFile(filePath, 'utf-8', async (err, rawData) => {
    if (err) {
      console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'Cannot read data file.');
      return;
    }

    let parsedData;

    switch (path.extname(filePath)) {
      case '.json':
        try {
          parsedData = JSON.parse(rawData);
        } catch (_error) {
          console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'JSON data file is invalid.');
          return;
        }
        break;

      case '.csv':
        try {
          parsedData = parse(rawData, {
            columns: true,
            skip_empty_lines: true,
            cast: (value) => (value === '' ? undefined : value),
          });
        } catch (_error) {
          console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'CSV data file is invalid.');
          return;
        }
        break;

      default:
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Data file format unrecognized. Supported file extensions: .json, .csv.',
        );
        return;
    }

    if (!Array.isArray(parsedData)) {
      throw new Error('Batch data should be array');
    }

    records = parsedData.map((entry, i) => {
      const formatted = formatAsRecord(entry, config);
      return Record.recordWithIncrementedTimestamp(formatted, config, increment + i);
    });

    await Promise.all(
      records.map(async (record) => {
        const recordPath = path.join(config.opts['files_origin'], record.getFileName());
        if (fs.existsSync(recordPath)) {
          throw new Error(`File ${recordPath} already exist`);
        }

        await fsPromises.writeFile(recordPath, record.getFileContent(shouldSaveId));
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
