import { parse } from 'csv-parse';
import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import { finished } from 'stream/promises';
import Record from '../core/models/record.js';
import Bibliography from '../core/models/bibliography.js';
import Config from '../core/models/config.js';
import Template from '../core/models/template.js';
import extractCitations from '../core/utils/citeExtractor.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import getGraph from '../core/utils/getGraph.js';
import Report from '../models/report-cli.js';
import getHistorySavePath from './history.js';
import citeLinks from '../core/utils/citeLinks.js';
import templateReport from '../core/utils/templateReport.js';
const { Readable } = require('stream');

/**
 * @typedef RecordLocator
 * @type {object}
 * @property {string} file
 * @property {number} [line]
 */

async function modelize(options) {
  const config = Config.get(Config.configFilePath);
  /** @type {import('../core/utils/templateReport.js').ReportWithLocator[]} */
  const report = [];

  options['citeproc'] = !!options['citeproc'] && config.canCiteproc();
  options['css_custom'] = !!options['customCss'] && config.canCssCustom();

  options = Object.entries(options)
    .map(([name, value]) => {
      return { name, value };
    })
    .filter(({ value }) => value === true);

  const optionsTemplate = options
    .filter(({ name }) => Template.validParams.has(name))
    .map(({ name }) => name);

  console.log(config.getConfigConsolMessage());

  switch (config.opts.select_origin) {
    case 'directory':
      if (config.canModelizeFromDirectory() === false) {
        return console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from directory with this config.',
        );
      }
      break;
    case 'csv':
      if (config.canModelizeFromCsvFiles() === false) {
        return console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from csv files with this config.',
        );
      }
      break;
    case 'online':
      if (config.canModelizeFromOnline() === false) {
        return console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from online csv files with this config.',
        );
      }
      break;
  }

  console.log(getModelizeMessage(optionsTemplate, config.opts.select_origin));

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  /** @type {Map<string, Record>} */
  const records = new Map();
  const recordsLocate = new Map();

  async function processNodes(filePath) {
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        cast: (value) => (value === '' ? undefined : value),
      }),
    );

    let lineNb = 1;
    parser.on('readable', function () {
      let line;
      while ((line = parser.read()) !== null) {
        const locator = `${filePath} at line ${lineNb}`;

        const { record, report: recordReport } = Record.recordFromCsv(line, config);
        recordReport.map((r) => ({ ...r, locator })).forEach((r) => report.push(r));

        records.set(record.id, record);
        recordsLocate.set(record.id, locator);

        lineNb++;
      }
    });
    await finished(parser);
  }

  async function processNodesOnline(url) {
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

    let lineNb = 1;
    parser.on('readable', function () {
      let line;
      while ((line = parser.read()) !== null) {
        const locator = `${url} at line ${lineNb}`;

        const { record, report: recordReport } = Record.recordFromCsv(line, config);
        recordReport.map((r) => ({ ...r, locator })).forEach((r) => report.push(r));

        records.set(record.id, record);
        recordsLocate.set(record.id, locator);

        lineNb++;
      }
    });
    await finished(parser);
  }

  async function processLinksOnline(url) {
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
        const record = records.get(line['source']);

        if (record) {
          record.addLink({
            contexts: line['label'] ? [line['label']] : [],
            target: line['target'],
            type: line['type'] || 'undefined',
            text: undefined,
          });
        }
      }
    });
    await finished(parser);
  }

  async function processLinks(filePath) {
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
        const record = records.get(line['source']);

        if (record) {
          record.addLink({
            contexts: line['label'] ? [line['label']] : [],
            target: line['target'],
            type: line['type'] || 'undefined',
            text: undefined,
          });
        }
      }
    });
    await finished(parser);
  }

  switch (config.opts.select_origin) {
    case 'directory': {
      let bibliography;

      if (
        optionsTemplate.includes('citeproc') &&
        config.opts['references_as_nodes'] &&
        config.canCiteproc()
      ) {
        const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(config);
        bibliography = new Bibliography(bib, cslStyle, xmlLocal);
      }

      await Promise.all(
        files.map(async (filePath) => {
          const locator = filePath;

          const content = await fsPromise.readFile(filePath, 'utf8');
          const { record, report: recordReport } = Record.recordFromFile(content, config);

          recordReport.map((r) => ({ ...r, locator })).forEach((r) => report.push(r));

          if (record) {
            records.set(record.id, record);
            recordsLocate.set(record.id, locator);

            if (bibliography) {
              const citeExtract = extractCitations(record.content);
              citeExtract.forEach((extract) =>
                extract.citations.forEach((cite) => {
                  const recordCite = Record.recordFromCiteItem(cite, config, bibliography);
                  records.set(recordCite.id, recordCite);
                  recordsLocate.set(recordCite.id, locator);
                }),
              );

              citeLinks(record.content).forEach((link) => record.addLink(link));
            }
          }
        }),
      );

      break;
    }
    case 'online': {
      await processNodesOnline(config.opts['nodes_online']);
      await processLinksOnline(config.opts['links_online']);

      break;
    }
    case 'csv': {
      await processNodes(config.opts['nodes_origin']);
      await processLinks(config.opts['links_origin']);

      break;
    }
    default: {
      throw new Error('Unknow method to modelize.');
    }
  }

  const { graph, brokenEdges } = getGraph(records, config);
  brokenEdges.forEach(({ source, target }) =>
    report.push({
      isError: false,
      locator: recordsLocate.get(source),
      message: `Link to "${target}" is broken`,
    }),
  );

  const { html } = new Template(records, graph, optionsTemplate);

  fs.writeFile(path.join(config.opts.export_target, 'cosmoscope.html'), html, (err) => {
    // Cosmoscope file for export folder
    if (err) {
      return console.error(
        ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
        'write Cosmoscope file: ' + err,
      );
    }
    console.log(
      ['\x1b[34m', 'Cosmoscope generated', '\x1b[0m'].join(''),
      `(${records.size} records)`,
    );
  });

  if (config.opts.history) {
    const projectScope = Config.configFilePath.includes(Config.configDirPath) ? 'global' : 'local';
    const projectName = path.parse(Config.configFilePath).name;

    getHistorySavePath(projectName, projectScope).then((filePath) => {
      fs.writeFile(filePath, html, (err) => {
        if (err) {
          console.error(
            ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
            'cannot save Cosmoscope in history folder: ' + err,
          );
        }
      });
    });
  }

  if (report.length > 0) {
    const htmlReport = templateReport('toto', report);
    fs.writeFile('report.html', htmlReport, (err) => {
      if (err) {
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'cannot save log file in history folder: ' + err,
        );
      }
    });
  }

  // if (Report.isItEmpty() === false) {
  //   try {
  //     await Report.makeDir();
  //     const pathSaveReport = await Report.save(config.opts.title);
  //     console.log(Report.getAsMessage());
  //     console.log(['\x1b[2m', pathSaveReport, '\x1b[0m'].join(''));
  //   } catch (err) {
  //     console.error(
  //       ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
  //       'cannot save log file in history folder: ' + err,
  //     );
  //   }
  // }
}

/**
 * @param {string[]} optionsTemplate
 * @param {string} originType
 */

function getModelizeMessage(optionsTemplate, originType) {
  const settings = optionsTemplate.filter((setting) => setting !== 'publish');

  const msgSetting =
    settings.length === 0 ? '' : `; settings: \x1b[1m${settings.join(', ')}\x1b[0m`;
  return `Building cosmoscope… (source type: \x1b[1m${originType}\x1b[0m${msgSetting})`;
}

export default modelize;
