import fsPromise from 'node:fs/promises';
import extractCitations from './citeExtractor.js';
import readYamlFrontmatter from './yamlfrontmatter.js';
import citeLinks from './citeLinks.js';
import formatAsRecord from './formatAsRecord.js';
import Record from '../models/record.js';
import unknownTypesMessage from './unknownTypesMessage.js';

/**
 *
 * @param {string} fileContent
 * @param {import('../models/config').default} config
 * @param {import('../models/bibliography').default} bibliography
 */

export default async function readRecordFile(filePath, config, bibliography) {
  const content = await fsPromise.readFile(filePath, 'utf8');

  /** @type {Record[]} */
  const records = [];
  /** @type {Record[]} */
  const recordsCiteproc = [];
  /** @type {import('../utils/writeReportFile').ReportItem[]} */
  const reportItems = [];

  let body, props;

  try {
    const { body: toto, head } = readYamlFrontmatter(content, { schema: 'failsafe' });
    body = toto;
    props = head;
  } catch (error) {
    reportItems.push({
      locator: { file: filePath, line: error.linePos[0].line },
      isError: true,
      message: error.message,
    });
    return {
      records,
      recordsCiteproc,
      reportItems,
    };
  }

  if (!props) {
    reportItems.push({
      locator: { file: filePath },
      isError: true,
      message: 'Yaml Front Matter is required.',
    });
    return {
      records,
      recordsCiteproc,
      reportItems,
    };
  }

  props = formatAsRecord(props, config);

  if (props.types) {
    const message = unknownTypesMessage(props.types, config);
    if (message) {
      reportItems.push({ locator: { file: filePath }, isError: false, message });
    }
  }

  const error = Record.getErrors(props, config);

  if (error) {
    reportItems.push({
      locator: { file: filePath },
      isError: true,
      message: error.message,
    });
    return {
      records,
      recordsCiteproc,
      reportItems,
    };
  }

  const record = Record.recordFromFile(body, props, config);
  records.push(record);

  if (bibliography) {
    const citeExtract = extractCitations(record.content);
    citeExtract.forEach((extract) =>
      extract.citations
        .filter((citeItem) => {
          if (bibliography.existsOnLibrary(citeItem)) {
            return true;
          }

          reportItems.push({
            isError: false,
            locator: { file: filePath },
            message: `Quote "${citeItem.id}" has no reference from library.`,
          });
        })
        .forEach((citeItem) => {
          const recordCite = Record.recordFromCiteItem(citeItem, config, bibliography);
          recordsCiteproc.push(recordCite);
        }),
    );

    citeLinks(record.content).forEach((link) => record.addLink(link));
  }

  return {
    records,
    recordsCiteproc,
    reportItems,
  };
}
