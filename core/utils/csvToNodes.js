import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import fs from 'fs';
import Record from '../models/record.js';

/**
 * @param {string} filePath
 * @param {Map<string, import('../models/record')>} records
 * @param {import('../models/config.js').default} config
 */

export async function processNodes(filePath, records, config) {
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );
  parser.on('readable', function () {
    let line;
    while ((line = parser.read()) !== null) {
      const record = Record.recordFromCsv(line, config);
      records.set(record.id, record);
    }
  });
  await finished(parser);
}

/**
 * @param {string} url
 * @param {Map<string, import('../models/record')>} records
 * @param {import('../models/config.js').default} config
 */

export async function processNodesOnline(url, records, config) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }

  const readableStream = Readable.fromWeb(response.body);

  const parser = readableStream.pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );

  parser.on('readable', function () {
    let line;
    while ((line = parser.read()) !== null) {
      const record = Record.recordFromCsv(line, config);
      records.set(record.id, record);
    }
  });
  await finished(parser);
}

/**
 * @param {string} url
 * @param {Map<string, import('../models/record')>} records
 */

export async function processLinksOnline(url, records) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }

  const readableStream = Readable.fromWeb(response.body);

  const parser = readableStream.pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );

  parser.on('readable', function () {
    let line;
    while ((line = parser.read()) !== null) {
      records.get(line['source']).addLink({
        contexts: line['label'] ? [line['label']] : [],
        target: line['target'],
        type: line['type'] || 'undefined',
        text: undefined,
      });
    }
  });
  await finished(parser);
}

/**
 * @param {string} filePath
 * @param {Map<string, import('../models/record')>} records
 */

export async function processLinks(filePath, records) {
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );
  parser.on('readable', function () {
    let line;
    while ((line = parser.read()) !== null) {
      records.get(line['source']).addLink({
        contexts: line['label'] ? [line['label']] : [],
        target: line['target'],
        type: line['type'] || 'undefined',
        text: undefined,
      });
    }
  });
  await finished(parser);
}
