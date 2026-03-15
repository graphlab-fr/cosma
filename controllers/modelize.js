import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import Bibliography from '../core/models/bibliography.js';
import Config from '../core/models/config.js';
import Template from '../core/models/template.js';
import findMarkdownFilesRecursively from '../core/utils/findMarkdownFilesRecursively.js';
import getGraph from '../core/utils/getGraph.js';
import getHistorySavePath from './history.js';
import {
  processLinks,
  processLinksOnline,
  processNodes,
  processNodesOnline,
} from '../core/utils/csvToNodes.js';
import writeReportFile from '../core/utils/writeReportFile.js';
import readRecordFile from '../core/utils/readRecordFile.js';
import envPaths from 'env-paths';
import getTimestampTuple from '../core/utils/timestamp.js';

const { log: envPathLogDir } = envPaths('cosma-cli', { suffix: '' });
const reportDir = path.join(envPathLogDir, 'logs');

async function modelize(options) {
  const config = Config.get(Config.configFilePath);

  const processedOptions = { ...options };
  processedOptions['citeproc'] = Boolean(processedOptions['citeproc']) && config.canCiteproc();
  processedOptions['css_custom'] = Boolean(processedOptions['customCss']) && config.canCssCustom();

  const optionsList = Object.entries(processedOptions)
    .map(([name, value]) => {
      return { name, value };
    })
    .filter(({ value }) => value === true);

  const optionsTemplate = optionsList
    .filter(({ name }) => Template.validParams.has(name))
    .map(({ name }) => name);

  console.log(config.getConfigConsolMessage());

  switch (config.opts.select_origin) {
    case 'directory':
      if (config.canModelizeFromDirectory() === false) {
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from directory with this config.',
        );
        return;
      }
      break;
    case 'csv':
      if (config.canModelizeFromCsvFiles() === false) {
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from csv files with this config.',
        );
        return;
      }
      break;
    case 'online':
      if (config.canModelizeFromOnline() === false) {
        console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from online csv files with this config.',
        );
        return;
      }
      break;
    default:
      throw new Error('Unknown data origin.');
  }

  console.log(getModelizeMessage(optionsTemplate, config.opts.select_origin));

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  /** @type {Map<string, Record>} */
  const records = new Map();
  /** @type {Map<string, Record>} */
  const recordsCiteproc = new Map();
  /** @type {Map<string, string>} */
  const recordFiles = new Map();

  /** @type {import('../core/utils/writeReportFile.js').ReportItem[]} */
  const reportMap = [];

  /**
   * @param {{
   *   records: Record[],
   *   reportItems: import('../core/utils/writeReportFile.js').ReportItem[]
   * }} input
   * @param {string} filePath
   */

  function pushAndReport(input, filePath) {
    input.records.forEach((r) => {
      if (records.has(r.id)) {
        reportMap.push({
          isError: true,
          locator: { file: filePath },
          message: `Id "${r.id}" is duplicated.`,
        });
        return;
      }

      records.set(r.id, r);
      recordFiles.set(r.id, filePath);
    });

    reportMap.push(...input.reportItems);
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
          const input = await readRecordFile(filePath, config, bibliography);
          pushAndReport(input, filePath);
          input.recordsCiteproc.forEach((r) => recordsCiteproc.set(r.id, r));
        }),
      );

      if (bibliography) {
        recordsCiteproc.forEach((record) => {
          const fileRecord = records.get(record.id);

          if (!fileRecord) {
            records.set(record.id, record);
            return;
          }

          const refType = config.opts.references_type_label;

          if (fileRecord.types.length === 1 && fileRecord.types[0] === 'undefined') {
            fileRecord.types = [refType];
          } else if (!fileRecord.types.includes(refType)) {
            fileRecord.types = [...fileRecord.types, refType];
          }
        });
      }
      break;
    }
    case 'online': {
      const filePath = config.opts['nodes_online'];
      const input = await processNodesOnline(filePath, config);
      pushAndReport(input, filePath);

      await processLinksOnline(config.opts['links_online'], records, config);

      break;
    }
    case 'csv': {
      const filePath = config.opts['nodes_origin'];
      const input = await processNodes(filePath, config);
      pushAndReport(input, filePath);

      await processLinks(config.opts['links_origin'], records, config);

      break;
    }
    default: {
      throw new Error('Unknow method to modelize.');
    }
  }

  const { graph, brokenEdges } = getGraph(records, config);

  brokenEdges.forEach(({ source, target }) => {
    const file = recordFiles.get(source);
    if (!file) {
      throw new Error('Source record file not found.');
    }

    reportMap.push({
      isError: true,
      locator: { file },
      message: `Link to "${target}" is broken.`,
    });
  });

  const { html } = new Template(records, graph, optionsTemplate);

  fs.writeFile(path.join(config.opts.export_target, 'cosmoscope.html'), html, (err) => {
    // Cosmoscope file for export folder
    if (err) {
      console.error(['\x1b[31m', 'Err.', '\x1b[0m'].join(''), 'write Cosmoscope file: ' + err);
      return;
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

  if (reportMap.length > 0) {
    const reportHtml = writeReportFile(reportMap, config);

    await fsPromise.mkdir(reportDir, { recursive: true });

    const reportFilePath = path.join(reportDir, getTimestampTuple().join('') + '.html');
    await fsPromise.writeFile(reportFilePath, reportHtml, 'utf8');

    console.log(reportMessage(reportMap));
    console.log(['\x1b[2m', reportFilePath, '\x1b[0m'].join(''));
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

/**
 * @param {import('../core/utils/writeReportFile.js').ReportItem[]} items
 * @returns
 */

function reportMessage(items) {
  const errors = items.filter((i) => i.isError);
  const warnings = items.filter((i) => !i.isError);

  let message = 'Report: ';
  const sentences = [];

  if (errors.length > 0) {
    sentences.push(`${errors.length} ${['\x1b[31m', 'errors', '\x1b[0m'].join('')}`);
  }
  if (warnings.length > 0) {
    sentences.push(`${warnings.length} ${['\x1b[33m', 'warnings', '\x1b[0m'].join('')}`);
  }

  message = message + sentences.join(' and ');

  return message;
}

export default modelize;
