/**
 * @file Manage the file directory and its data to generate a graph
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import { parse } from 'csv-parse';
import Config from './config.js';
import Record from './record.js';
import Bibliography from './bibliography.js';
import Report from './report.js';
import { read as readYmlFm } from '../utils/yamlfrontmatter.js';
import { ReadCsvFileNodesError, ReadCsvFileLinksError, ReadCsvLinesLinksError } from './errors.js';
import quoteIdsWithContexts from '../utils/quoteIdsWithContexts.js';
import GraphEngine from 'graphology';
import { scaleLinear } from 'd3';

/**
 * @typedef File
 * @type {object}
 * @property {string} path
 * @property {string} name
 * @property {string} content
 * @property {FileMetas} metas
 */

/**
 * @typedef FileMetas
 * @type {object}
 * @property {string} id
 * @property {string} title
 * @property {string[]} types
 * @property {string[]} tags
 * @property {string[]} references
 * @property {string | undefined} thumbnail
 * @property {number} begin
 * @property {number} end
 */

/**
 * @typedef LinkNormalized
 * @type {object}
 * @property {string} type
 * @property {object} target
 * @property {number} target.id
 */

class Cosmoscope {
  /**
   * @param {fs.PathLike} pathToFiles
   * @returns {File[]}
   */

  static getFromPathFiles(pathToFiles) {
    const filesPath = glob
      .sync('**/*.md', {
        cwd: pathToFiles,
      })
      .map((file) => path.join(pathToFiles, file));

    /** @type {File[]} */
    let files = filesPath
      .map((filePath) => {
        const fileContain = fs.readFileSync(filePath, 'utf8');

        /** @type {File} */
        const file = Cosmoscope.getDataFromYamlFrontMatter(fileContain, filePath);

        return file;
      })
      .filter(({ name, metas }) => {
        if (metas.id === undefined && metas.title === undefined) {
          new Report(name, '', 'error').aboutNoId(name);
          return false;
        }
        return true;
      });

    return files;
  }

  /**
   * @param {string} fileContain
   * @param {string} filePath
   * @returns {File}
   */

  static getDataFromYamlFrontMatter(fileContain, filePath) {
    let fm;

    try {
      fm = readYmlFm(fileContain, { schema: 'failsafe' });
    } catch (e) {
      console.error(filePath + ' could not have its frontmatter parsed.');
      throw new SyntaxError('YAML parse error on ' + filePath);
    }

    const { head: metas, content } = fm;

    /** @type {File} */
    const file = {
      path: filePath,
      name: path.basename(filePath),
      content,
      metas,
    };

    file.metas.id = file.metas['id'] && String(file.metas['id']);
    file.metas.title = file.metas['title'] && String(file.metas['title']);

    file.metas.types = file.metas['types'] || file.metas['type'] || [];
    delete file.metas['type'];
    if (Array.isArray(file.metas.types) === false) {
      file.metas.types = [file.metas.types];
    }
    if (file.metas.types.length === 0) {
      file.metas.types = ['undefined'];
    }

    file.metas.tags =
      file.metas['tags'] ||
      file.metas['tag'] ||
      file.metas['keywords'] ||
      file.metas['keyword'] ||
      [];
    delete file.metas['tag'];
    delete file.metas['keywords'];
    delete file.metas['keyword'];
    if (Array.isArray(file.metas.tags) === false) {
      file.metas.tags = [file.metas.tags];
    }

    file.metas.references = file.metas['references'] || file.metas['reference'] || [];
    delete file.metas['reference'];
    if (Array.isArray(file.metas.references) === false) {
      file.metas.references = [file.metas.references];
    }

    file.metas.begin = Number(new Date(file.metas.begin));
    file.metas.end = Number(new Date(file.metas.end));

    return file;
  }

  /**
   * Get formated data for links and nodes
   * @param {fs.PathLike} recordsFilePath
   * @param {fs.PathLike} linksFilePath
   * @returns {Promise<[FormatedRecordData[], FormatedLinkData[]]>}
   */

  static getFromPathCsv(recordsFilePath, linksFilePath) {
    const recordsPromise = new Promise((resolve, reject) => {
      fs.readFile(recordsFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(new ReadCsvFileNodesError({ filePath: err.path }));
          return;
        }
        const records = [];
        parse(data, {
          columns: true,
          skip_empty_lines: true,
        })
          .on('readable', function () {
            let line,
              i = 1;
            while ((line = this.read()) !== null) {
              i++;
              if (!!line['id'] && !!line['title']) {
                records.push(Record.getFormatedDataFromCsvLine(line));
                continue;
              }
              new Report('ignored_csv_line', '', 'error').aboutIgnoredCsvLine(
                recordsFilePath,
                '"nodes"',
                i,
                [...(!line['id'] ? ['"id"'] : []), ...(!line['title'] ? ['"title"'] : [])],
              );
            }
          })
          .on('error', reject)
          .on('end', () => resolve(records));
      });
    });

    function getFormatedDataFromCsvLine({ source, target, label, type }) {
      return { source, target, label, type: type || 'undefined' };
    }

    const linksPromise = new Promise((resolve, reject) => {
      fs.readFile(linksFilePath, 'utf-8', (err, data) => {
        if (err) {
          reject(new ReadCsvFileLinksError({ filePath: err.path }));
          return;
        }
        const links = [];
        parse(data, {
          columns: true,
          skip_empty_lines: true,
        })
          .on('readable', function () {
            let line,
              i = 1;
            while ((line = this.read()) !== null) {
              i++;
              if (!!line['source'] && !!line['target']) {
                links.push(getFormatedDataFromCsvLine(line));
                continue;
              }
              new Report('ignored_csv_line', '', 'error').aboutIgnoredCsvLine(
                linksFilePath,
                '"links"',
                i,
                [
                  ...(!line['source'] ? ['"source"'] : []),
                  ...(!line['target'] ? ['"target"'] : []),
                ],
              );
            }
          })
          .on('error', (err) => reject(new ReadCsvLinesLinksError(err)))
          .on('end', () => resolve(links));
      });
    });

    return Promise.all([recordsPromise, linksPromise]);
  }

  /**
   * @param {File[]} files
   * @param {Config.opts} opts
   * @returns {Record[]}
   */

  static _getRecordsFromFiles(files, opts = {}) {
    return files.map((file) => {
      let { id, title, types, tags, thumbnail, references, begin, end, ...metas } = file.metas;
      id = id || file.metas['title'].toLowerCase();

      const bibliographicRecords = [
        ...Bibliography.getBibliographicRecordsFromText(file.content),
        ...Bibliography.getBibliographicRecordsFromList(file.metas.references),
      ];

      const record = new Record(
        id,
        title,
        types,
        tags,
        metas,
        file.content,
        begin,
        end,
        bibliographicRecords,
        thumbnail,
        opts,
      );
      record.setWikiLinksFromContent();

      return record;
    });
  }

  /**
   * @param {Record[]} records
   * @param {Config.opts} opts
   * @returns {Record[]}
   */

  static getBibliographicRecords(records, opts = {}) {
    const config = new Config(opts);

    const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(config);
    const bibliography = new Bibliography(bib, cslStyle, xmlLocal);

    let referenceRecords = new Map([]);

    records.forEach(({ id: recordId, bibliographicRecords }) => {
      bibliographicRecords.forEach(({ target, contexts }) => {
        if (!bibliography.library[target]) return;

        if (referenceRecords.has(target)) {
          const ref = referenceRecords.get(target);
          ref.targets.add(recordId);

          if (ref.contexts.has(recordId)) {
            ref.contexts.get(recordId).push(...contexts);
          } else {
            ref.contexts.set(recordId, contexts);
          }
        } else {
          referenceRecords.set(target, {
            contexts: new Map([[recordId, contexts]]),
            targets: new Set([recordId]),
          });
        }
      });
    });

    /** @type {Record[]} */
    const bibliographicRecords = [];

    referenceRecords.forEach((targets, key) => {
      bibliography.citeproc.updateItems([key]);
      let content = bibliography.citeproc
        .makeBibliography()[1]
        .map((t) => Bibliography.getFormatedHtmlBibliographicRecord(t))[0];

      const title = bibliography.library[key]['title'] || '';

      bibliographicRecords.push(
        new Record(
          key,
          title,
          [opts['references_type_label']],
          undefined,
          undefined,
          content,
          undefined,
          undefined,
          undefined,
          undefined,
          opts,
        ),
      );
    });

    return bibliographicRecords;
  }

  /**
   * Get the index from which to create new records in the mass
   * The index depends on the identifier of the last record created in the mass
   * The index is obtained via the Graph analysis
   * @param {string} filesPath
   * @return {number}
   */

  static getIndexToMassSave(filesPath) {
    const todayMassSavedRecordIds = Cosmoscope.getFromPathFiles(filesPath) // get graph analyse
      .map((file) => Number(file.metas.id))
      .filter(Record.isTodayOutDailyId) // ignore not today mass saved records id
      .sort();

    const lastRecordId = todayMassSavedRecordIds.at(-1);

    if (lastRecordId) {
      // 20231127246188 - 20231127246060 = 128, the index for the next record is 128 + 1
      return lastRecordId - Record.generateOutDailyId();
    }
    return 0;
  }

  constructor(records, opts, params) {}
}

export default Cosmoscope;
