import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import Record from '../core/models/record.js';
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

  /** @type {import('../core/utils/writeReportFile.js').ReportItem[]} */
  const reportMap = [];

  /**
   * @param {{
   *   records: Record[],
   *   reportItems: import('../core/utils/writeReportFile.js').ReportItem[]
   * }} input
   * @param {Map<string, Record>} records
   */

  function pushAndReport(input) {
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
          pushAndReport(input);
        }),
      );

      break;
    }
    case 'online': {
      const input = await processNodesOnline(config.opts['nodes_online'], config);
      pushAndReport(input);

      await processLinksOnline(config.opts['links_online'], records);

      break;
    }
    case 'csv': {
      const input = await processNodes(config.opts['nodes_origin'], config);
      pushAndReport(input);

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

  if (reportMap.length > 0) {
    const reportHtml = writeReportFile(reportMap);
    await fsPromise.writeFile('./toto.html', reportHtml, 'utf8');
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
