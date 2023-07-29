/**
 * @file Manage the file directory and its data to generate a graph
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

/**
 * @typedef File
 * @type {object}
 * @property {string} path
 * @property {string} name
 * @property {string} content
 * @property {FileMetas} metas
 * @property {FileDates} dates
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
 * @typedef FileDates
 * @type {object}
 * @property {Date} lastOpen
 * @property {Date} lastEdit
 * @property {Date} created
 * @property {Date} timestamp
 */

/**
 * @typedef LinkNormalized
 * @type {object}
 * @property {string} type
 * @property {object} target
 * @property {number} target.id
 */

const fs = require('fs'),
  path = require('path'),
  glob = require('glob'),
  { parse } = require('csv-parse'),
  { read: readYmlFm } = require('../utils/yamlfrontmatter');

const {
  ReadCsvFileNodesError,
  ReadCsvFileLinksError,
  ReadCsvLinesLinksError,
} = require('./errors');

const Graph = require('./graph'),
  Config = require('./config'),
  Node = require('./node'),
  Link = require('./link'),
  Record = require('./record'),
  Bibliography = require('./bibliography'),
  Report = require('./report');

module.exports = class Cosmoscope extends Graph {
  /**
   * @param {fs.PathLike} pathToFiles
   * @returns {File[]}
   */

  static getFromPathFilesAsync(pathToFiles) {
    const files = [];
    return new Promise((resolve, reject) => {
      glob('**/*.md', { cwd: pathToFiles, realpath: true }, (err, filesPath) => {
        if (err) {
          reject(err);
        }
        Promise.all(
          filesPath.map((filePath) => {
            return new Promise((resolveFile, rejectFile) => {
              return fs.readFile(filePath, 'utf-8', (err, fileContain) => {
                if (err) {
                  rejectFile(err);
                }
                const { __content: content, ...metas } = ymlFM.loadFront(fileContain);
                /** @type {File} */
                const file = {
                  path: filePath,
                  name: path.basename(filePath),
                  lastEditDate: fs.statSync(filePath).mtime,
                  content,
                  metas,
                };
                file.metas.type = file.metas.type || 'undefined';
                file.metas.tags = file.metas['tags'] || file.metas['keywords'] || [];
                file.metas.id = file.metas.id;
                file.metas.references = file.metas.references || [];
                files.push(file);
                resolveFile();
              });
            });
          })
        )
          .then(() => resolve(files))
          .catch((err) => reject);
      });
    });
  }

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

        const { atime, mtime, birthtime } = fs.statSync(filePath);

        file.dates = {
          created: atime,
          lastOpen: birthtime,
          lastEdit: mtime,
        };

        const idAsNumber = Number(file.metas.id);
        if (file.metas.id.length === 14 && isNaN(idAsNumber) === false) {
          file.dates.timestamp = Record.getDateFromId(idAsNumber);
        }

        return file;
      })
      .filter(({ name, metas }) => {
        if (metas.id === undefined) {
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
    const { head: metas, content } = readYmlFm(fileContain, { schema: 'failsafe' });

    /** @type {File} */
    const file = {
      path: filePath,
      name: path.basename(filePath),
      content,
      metas,
    };

    file.metas.id = String(file.metas['id']);
    file.metas.title = String(file.metas['title']);
    file.metas.thumbnail = file.metas['thumbnail'];

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
                [...(!line['id'] ? ['"id"'] : []), ...(!line['title'] ? ['"title"'] : [])]
              );
            }
          })
          .on('error', reject)
          .on('end', () => resolve(records));
      });
    });

    // const ignoreLinesLinks = [];

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
                links.push(Link.getFormatedDataFromCsvLine(line));
                continue;
              }
              new Report('ignored_csv_line', '', 'error').aboutIgnoredCsvLine(
                linksFilePath,
                '"links"',
                i,
                [...(!line['source'] ? ['"source"'] : []), ...(!line['target'] ? ['"target"'] : [])]
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

  static getRecordsFromFiles(files, opts = {}) {
    const links = files
      .map((file) => {
        const { id } = file.metas;
        const { content } = file;
        return Link.getWikiLinksFromFileContent(id, content);
      })
      .flat();

    const nodes = files.map((file) => {
      let { id, title, types } = file.metas;
      return new Node(id, title, types[0]);
    });

    const records = files.map((file) => {
      const { id, title, types, tags, thumbnail, references, ...metas } = file.metas;
      const { linksReferences, backlinksReferences } = Link.getReferencesFromLinks(
        id,
        links,
        nodes
      );
      const bibliographicRecords = [
        ...Bibliography.getBibliographicRecordsFromText(file.content),
        ...Bibliography.getBibliographicRecordsFromList(references),
      ];

      let { begin, end } = metas;
      begin = begin || Number(file.dates[opts.chronological_record_meta]);
      delete metas.end;
      delete metas.begin;

      return new Record(
        id,
        title,
        types,
        tags,
        metas,
        file.content,
        linksReferences,
        backlinksReferences,
        begin,
        end,
        bibliographicRecords,
        thumbnail,
        opts
      );
    });

    return records;
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
      .map((file) => file.metas.id)
      .filter(Record.isTodayOutDailyId) // ignore not today mass saved records id
      .sort();

    // 'todayMassSavedRecordIds' can be empty
    let lastId = todayMassSavedRecordIds[todayMassSavedRecordIds.length - 1] || undefined;
    // 20220115246695 - 20220115246060 = 635, the index for the next record is 635 + 1
    return lastId - Record.generateOutDailyId() + 1 || 1;
  }

  constructor(records, opts, params) {
    super(records, opts, params);
  }
};
