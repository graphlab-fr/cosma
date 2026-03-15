import { Readable } from 'node:stream';
import { parse } from 'csv-parse';
import { finished } from 'node:stream/promises';
import fs from 'node:fs';
import Record from '../models/record.js';
import formatAsRecord from './formatAsRecord.js';
import unknownTypesMessage from './unknownTypesMessage.js';

/**
 * @param {string} filePath
 * @param {Map<string, import('../models/record')>} records
 * @param {import('../models/config.js').default} config
 */

export async function processNodes(filePath, config) {
  /** @type {Record[]} */
  const records = [];
  /** @type {import('../utils/writeReportFile').ReportItem[]} */
  const reportItems = [];

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );
  parser.on('readable', () => {
    let line;
    let i = 1;

    while ((line = parser.read()) !== null) {
      i++;

      const props = formatAsRecord(line, config);

      if (props.types) {
        const message = unknownTypesMessage(props.types, config);
        if (message) {
          reportItems.push({ locator: { file: filePath, line: i }, isError: false, message });
        }
      }

      const error = Record.getErrors(props);

      if (error) {
        reportItems.push({
          locator: { file: filePath, line: i },
          isError: true,
          message: error.message,
        });
        continue;
      }

      const record = Record.recordFromCsv(props, config);
      records.push(record);
    }
  });

  await finished(parser);

  return {
    records,
    reportItems,
  };
}

/**
 * @param {string} url
 * @param {Map<string, import('../models/record')>} records
 * @param {import('../models/config.js').default} config
 */

export async function processNodesOnline(url, config) {
  /** @type {Record[]} */
  const records = [];
  /** @type {import('../utils/writeReportFile').ReportItem[]} */
  const reportItems = [];

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

  parser.on('readable', () => {
    let line;
    let i = 1;

    while ((line = parser.read()) !== null) {
      i++;

      const props = formatAsRecord(line, config);

      if (props.types) {
        const message = unknownTypesMessage(props.types, config);
        if (message) {
          reportItems.push({ locator: { file: url, line: i }, isError: false, message });
        }
      }

      const error = Record.getErrors(line, config);

      if (error) {
        reportItems.push({
          locator: { file: url, line: i },
          isError: true,
          message: error.message,
        });
        continue;
      }

      const record = Record.recordFromCsv(line, config);
      records.push(record);
    }
  });

  await finished(parser);

  return {
    records,
    reportItems,
  };
}

/**
 * @param {string} url
 * @param {Map<string, import('../models/record')>} records
 * @param {import('../models/config.js').default} config
 */

export async function processLinksOnline(url, records, config) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.statusText}`);
  }

  const linkTypes = config.getTypesLinks();

  const readableStream = Readable.fromWeb(response.body);

  const parser = readableStream.pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );

  parser.on('readable', () => {
    let line;

    while ((line = parser.read()) !== null) {
      let linkType = 'undefined';

      if (linkTypes.has(line['type'])) {
        linkType = line['type'];
      }

      records.get(line['source']).addLink({
        contexts: line['label'] ? [line['label']] : [],
        target: line['target'],
        type: linkType,
        text: undefined,
      });
    }
  });

  await finished(parser);
}

/**
 * @param {string} filePath
 * @param {Map<string, import('../models/record').default>} records
 * @param {import('../models/config.js').default} config
 */

export async function processLinks(filePath, records, config) {
  const linkTypes = config.getTypesLinks();

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      cast: (value) => (value === '' ? undefined : value),
    }),
  );
  parser.on('readable', () => {
    let line;

    while ((line = parser.read()) !== null) {
      let linkType = 'undefined';

      if (linkTypes.has(line['type'])) {
        linkType = line['type'];
      }

      records.get(line['source']).addLink({
        contexts: line['label'] ? [line['label']] : [],
        target: line['target'],
        type: linkType,
        text: undefined,
      });
    }
  });

  await finished(parser);
}
