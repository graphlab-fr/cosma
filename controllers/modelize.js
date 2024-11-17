import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';
import getHistorySavePath from './history.js';
import Cosmoscope from '../core/models/cosmoscope.js';
import Record from '../core/models/record.js';
import Rrecord from '../core/models/_record.js';
import Config from '../core/models/config.js';
import Template from '../core/models/template.js';
import Report from '../models/report-cli.js';
import { DowloadOnlineCsvFilesError } from '../core/models/errors.js';
import { downloadFile } from '../core/utils/misc.js';
import { tmpdir } from 'node:os';
import getGraph from '../core/utils/getGraph.js';
import extractCitations from '../core/utils/citeExtractor.js';
import Bibliography from '../core/models/bibliography.js';

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

  const {
    select_origin: originType,
    files_origin: filesPath,
    nodes_online: nodesUrl,
    links_online: linksUrl,
    export_target: exportPath,
    history,
  } = config.opts;

  let { nodes_origin: nodesPath, links_origin: linksPath } = config.opts;

  console.log(config.getConfigConsolMessage());

  switch (originType) {
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
      try {
        await config.canModelizeFromOnline();
      } catch (err) {
        return console.error(
          ['\x1b[31m', 'Err.', '\x1b[0m'].join(''),
          'Cannot modelize from online csv files with this config.',
        );
      }
      break;
  }

  console.log(getModelizeMessage(optionsTemplate, originType));

  async function findMarkdownFilesRecursively(dir) {
    let results = [];

    const list = await fsPromise.readdir(dir);

    for (const file of list) {
      const filePath = path.resolve(dir, file);
      const stat = await fsPromise.stat(filePath);

      if (stat.isDirectory()) {
        // call for subdirs
        const res = await findMarkdownFilesRecursively(filePath);
        results = results.concat(res);
      } else {
        if (path.extname(file) === '.md') {
          results.push(filePath);
        }
      }
    }

    return results;
  }

  const files = await findMarkdownFilesRecursively(config.opts['files_origin']);

  /** @type {Map<string, Rrecord>} */
  const records = new Map();

  const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(config);
  const bibliography = new Bibliography(bib, cslStyle, xmlLocal);

  switch (originType) {
    case 'directory': {
      await Promise.all(
        files.map(async (filePath) => {
          const content = await fsPromise.readFile(filePath, 'utf8');
          const record = Rrecord.recordFromFile(content, config);
          records.set(record.id, record);

          const citeExtract = extractCitations(record.content);
          citeExtract.forEach((extract) =>
            extract.citations.forEach((cite) => {
              const record = Rrecord.recordFromCiteItem(cite, config, bibliography);
              records.set(record.id, record);
            }),
          );
        }),
      );

      break;
    }
    // case 'online': {
    //   const tempDir = tmpdir();
    //   nodesPath = path.join(tempDir, 'cosma-nodes.csv');
    //   linksPath = path.join(tempDir, 'cosma-links.csv');
    //   try {
    //     await downloadFile(nodesUrl, nodesPath);
    //     console.log('- Nodes file downloaded');
    //     await downloadFile(linksUrl, linksPath);
    //     console.log('- Links file downloaded');
    //   } catch (error) {
    //     throw new DowloadOnlineCsvFilesError(error);
    //   }
    // }
    // case 'csv': {
    //   let [formatedRecords, formatedLinks] = await Cosmoscope.getFromPathCsv(nodesPath, linksPath);
    //   records = Record.formatedDatasetToRecords(formatedRecords, formatedLinks, config);
    //   break;
    // }
  }

  // console.log(records.size);
  const graph = getGraph(records, config);

  const { html } = new Template(records, graph, optionsTemplate);

  fs.writeFile(path.join(exportPath, 'cosmoscope.html'), html, (err) => {
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

  if (history) {
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
