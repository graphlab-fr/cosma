import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
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
import {
  processLinks,
  processLinksOnline,
  processNodes,
  processNodesOnline,
} from '../core/utils/csvToNodes.js';

/**
 * @typedef ReportLocator
 * @type {object}
 * @property {string} file
 * @property {number} [line]
 */

/**
 * @typedef ReportItem
 * @type {object}
 * @property {ReportLocator} locator
 * @property {boolean} isError
 * @property {string} message
 */

async function modelize(options) {
  let config = Config.get(Config.configFilePath);

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
    default:
      throw new Error('Unknown data origin.');
  }

  console.log(getModelizeMessage(optionsTemplate, config.opts.select_origin));

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  /** @type {Map<string, Record>} */
  const records = new Map();

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
          const content = await fsPromise.readFile(filePath, 'utf8');
          const record = Record.recordFromFile(content, config);
          records.set(record.id, record);

          if (bibliography) {
            const citeExtract = extractCitations(record.content);
            citeExtract.forEach((extract) =>
              extract.citations
                .filter((cite) => bibliography.existsOnLibrary(cite))
                .forEach((cite) => {
                  const recordCite = Record.recordFromCiteItem(cite, config, bibliography);
                  records.set(recordCite.id, recordCite);
                }),
            );

            citeLinks(record.content).forEach((link) => record.addLink(link));
          }
        }),
      );

      break;
    }
    case 'online': {
      await processNodesOnline(config.opts['nodes_online'], records, config);
      await processLinksOnline(config.opts['links_online'], records);

      break;
    }
    case 'csv': {
      await processNodes(config.opts['nodes_origin'], records, config);
      await processLinks(config.opts['links_origin'], records);

      break;
    }
    default: {
      throw new Error('Unknow method to modelize.');
    }
  }

  const { graph } = getGraph(records, config);

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

  if (Report.isItEmpty() === false) {
    try {
      await Report.makeDir();
      const pathSaveReport = await Report.save(config.opts.title);
      console.log(Report.getAsMessage());
      console.log(['\x1b[2m', pathSaveReport, '\x1b[0m'].join(''));
    } catch (err) {
      console.error(
        ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
        'cannot save log file in history folder: ' + err,
      );
    }
  }
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
