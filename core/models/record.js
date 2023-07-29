/**
 * @file Format data for records, verif and save as file
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

/**
 * @typedef Direction
 * @type {object}
 * @property {number} id
 * @property {string} title
 * @property {string} type
 */

/**
 * @typedef Reference
 * @type {object}
 * @property {string} context
 * @property {string} type
 * @property {Direction} source
 * @property {Direction} target
 */

/**
 * @typedef DeepFormatedRecordData
 * @type {object}
 * @property {string|undefined} id
 * @property {string} title
 * @property {object} content
 * @property {object} type
 * @property {object} metas
 * @property {object} tags
 * @property {object} time
 * @property {string[]} references
 * @property {string} thumbnail
 */

/**
 * @typedef FormatedRecordData
 * @type {object}
 * @property {string|undefined} id
 * @property {string} title
 * @property {string} content
 * @property {string[]} types
 * @property {object} metas
 * @property {string[]} tags
 * @property {string[]} references
 * @property {string} begin
 * @property {string} end
 * @property {string} thumbnail
 */

const path = require('path'),
  fs = require('fs'),
  yml = require('yaml'),
  slugify = require('slugify');

const Config = require('./config'),
  Bibliography = require('./bibliography'),
  Node = require('./node'),
  Link = require('./link'),
  lang = require('./lang'),
  Report = require('./report');

const { getTimestampTuple } = require('../utils/misc');

const { RecordMaxOutDailyIdError } = require('./errors');

module.exports = class Record {
  /**
   * Get data from a fromated CSV line
   * @param {object} line
   * @return {DeepFormatedRecordData}
   * ```
   * Record.getFormatedDataFromCsvLine({
   *    'title': 'Paul Otlet',
   *    'type:étude': 'documentation',
   *    'type:relation': 'ami',
   *    'tag:genre': 'homme',
   *    'content:biography': 'Lorem ipsum...',
   *    'content:notes': 'Lorem ipsum...',
   *    'meta:prenom': 'Paul',
   *    'meta:nom': 'Otlet',
   *    'time:begin': '1868',
   *    'time:end': '1944',
   *    'thumbnail': 'photo.jpg',
   *    'references': 'otlet1934'
   *})
   * ```
   */

  static getDeepFormatedDataFromCsvLine({ title, id, thumbnail, references = [], ...rest }) {
    let content = {},
      type = {},
      metas = {},
      tags = {};
    for (const [key, value] of Object.entries(rest)) {
      const [field, label] = key.split(':', 2);
      if (field === 'time') {
        continue;
      }
      switch (field) {
        case 'content':
          content[label] = value;
          break;
        case 'type':
          type[label] = value;
          break;
        case 'tag':
          tags[label] = value;
          break;
        case 'meta':
        default:
          if (!!label && !!value) {
            metas[label] = value;
          }
          break;
      }
    }

    if (typeof references === 'string') {
      references = references.split(',');
    }

    return {
      id,
      title,
      content,
      type,
      metas,
      tags,
      references,
      time: {
        begin: rest['time:begin'],
        end: rest['time:end'],
      },
      thumbnail: thumbnail,
    };
  }

  /**
   * Get data from a fromated CSV line
   * @param {object} line
   * @return {FormatedRecordData}
   * ```
   * Record.getFormatedDataFromCsvLine({
   *    'title': 'Paul Otlet',
   *    'type:étude': 'documentation',
   *    'type:relation': 'ami',
   *    'tag:genre': 'homme',
   *    'content:biography': 'Lorem ipsum...',
   *    'content:notes': 'Lorem ipsum...',
   *    'meta:prenom': 'Paul',
   *    'meta:nom': 'Otlet',
   *    'time:begin': '1868',
   *    'time:end': '1944',
   *    'thumbnail': 'photo.jpg',
   *    'references': 'otlet1934'
   *})
   * ```
   */

  static getFormatedDataFromCsvLine({ title, id, thumbnail, references = [], ...rest }) {
    if (!title || typeof title !== 'string') {
      throw "'title' is a required meta for a record";
    }

    let contents = [],
      types = [],
      metas = {},
      tags = [],
      begin,
      end;
    for (const [key, value] of Object.entries(rest)) {
      const [field, label] = key.split(':', 2);
      switch (field) {
        case 'content':
          if (label) {
            contents.push([`<h3>${label}</h3>`, value]);
          } else {
            contents.push(value);
          }
          break;
        case 'type':
          value && types.push(value);
          break;
        case 'keyword':
        case 'tag':
          value && tags.push(value);
          break;
        case 'time':
          if (label === 'begin') {
            begin = value;
          }
          if (label === 'end') {
            end = value;
          }
          break;
        case 'reference':
          references = value.split(',');
          break;
        case 'meta':
        default:
          if (value) {
            metas[label || key] = value;
          }
          break;
      }
    }

    if (types.length === 0) {
      types = ['undefined'];
    }
    if (typeof references === 'string') {
      references = references.split(',');
    }
    const content = contents
      .map((content) => {
        if (Array.isArray(content)) {
          return content.join('\n\n');
        }
        return content;
      })
      .join('\n\n');

    return {
      id,
      title,
      content,
      types,
      metas,
      tags,
      references,
      begin,
      end,
      thumbnail,
    };
  }

  /**
   * @param {FormatedRecordData[]} data
   * @param {Link[]} links
   * @param {Config} config
   * @returns {Record[]}
   */

  static formatedDatasetToRecords(data, links, config) {
    if (!config || config instanceof Config === false) {
      throw new Error('Need instance of Config to process');
    }

    const nodes = data.map(({ id, title, types }) => new Node(id, title, types[0]));

    return data.map((line) => {
      const { id, title, content, types, metas, tags, references, begin, end, thumbnail } = line;

      const { linksReferences, backlinksReferences } = Link.getReferencesFromLinks(
        id,
        links,
        nodes
      );
      const bibliographicRecords = Bibliography.getBibliographicRecordsFromList(references);

      return new Record(
        id,
        title,
        types,
        tags,
        metas,
        content,
        linksReferences,
        backlinksReferences,
        begin,
        end,
        bibliographicRecords,
        thumbnail,
        config.opts
      );
    });
  }

  /**
   * Force save as file several records
   * @param {FormatedRecordData[]} data
   * @param {number} index
   * @param {Config.opts} configOpts
   * @return {number[]|true} Invalid items key or true
   * @example
   * Record.massSave([
   *  { title: 'Idea 1', type: 'ideas', tags: 'tag 1,tag 2' ... }
   *  { title: 'Concept 1', type: 'concept' ... }
   * ])
   */

  static massSave(data, index, configOpts) {
    return new Promise((resolve, reject) => {
      try {
        if (!index || typeof index !== 'number') {
          throw new Error('The index for record mass save is invalid');
        }

        const records = data.map(
          ({ title, type, tags, metas, content, begin, end, references = [], thumbnail }) => {
            index++;
            return new Record(
              Record.generateOutDailyId() + index,
              title,
              type,
              tags,
              metas,
              content,
              undefined,
              undefined,
              begin,
              end,
              Bibliography.getBibliographicRecordsFromList(references),
              thumbnail,
              configOpts
            );
          }
        );

        Promise.all(records.map((record) => record.saveAsFile(true)))
          .then(() => resolve())
          .catch(() => reject('Some records throw error'));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @param {string} fileName
   * @returns {string}
   * @exemple
   * ```
   * Record.getSlugFileName('My [@récörd?!]') // => 'My record.md'
   * ```
   */

  static getSlugFileName(fileName) {
    const slugName = slugify(fileName, {
      replacement: '-',
      remove: /[&*+=~'"!?:@#$%^(){}\[\]\\/]/g,
      lower: true,
    });
    return slugName + '.md';
  }

  /**
   * Get a number (14 caracters) from the time stats :
   * year + month + day + hour + minute + second
   * @return {string} - unique 14 caracters number timestamp from the second
   * @example '20210322123312'
   */

  static generateId() {
    return getTimestampTuple().join('');
  }

  /**
   * Get an id, as Record.generateId(), but out of the daily hour, minute, second
   * The hour, minute, second are out of the daily common time, as 25 hours, 84 minutes and 61 secondes
   * @param {number} [increment = 0] Positive number to add
   * @return {string} - 14 caracters number
   * @example
   * ```
   * // At day 2022-01-15
   * Record.generateOutDailyId(5);
   * '20220115246065'
   * Record.generateOutDailyId(100);
   * '20220115246160'
   * ```
   */

  static generateOutDailyId(increment = 0) {
    const [year, month, day] = getTimestampTuple();
    const min = Number('24' + '60' + '60');
    const max = Number('99' + '99' + '99');
    if (increment < 0) {
      increment = 0;
    }
    const result = min + increment;
    if (result > max) {
      throw new RecordMaxOutDailyIdError();
    }
    return [year, month, day, result.toString()].join('');
  }

  /**
   * Test if an id is out of today common time
   * @param {number} idTest Id as number
   * @return {boolean}
   */

  static isTodayOutDailyId(idTest) {
    let todayOutDailyId = Record.generateOutDailyId();
    // An id from common time or from another day will be negative
    if (idTest - todayOutDailyId >= 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param {number} id Id as number
   * @return {Date|undefined}
   */

  static getDateFromId(id) {
    const recordIdAsString = id.toString();
    const year = recordIdAsString.substring(0, 4);
    const month = recordIdAsString.substring(4, 6);
    const day = recordIdAsString.substring(6, 8);
    const hour = recordIdAsString.substring(8, 10);
    const minute = recordIdAsString.substring(10, 12);
    const second = recordIdAsString.substring(12, 14);
    if (year && month && day && hour && minute && second) {
      const date = new Date(`${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`);
      if (isNaN(date)) {
        return undefined;
      } else {
        return date;
      }
    }
    return undefined;
  }

  /**
   * @param {Reference[]} referenceArray
   * @returns {boolean}
   */

  static verifReferenceArray(referenceArray) {
    if (Array.isArray(referenceArray) === false) {
      return false;
    }
    for (const reference of referenceArray) {
      if (typeof reference !== 'object') {
        return false;
      }
      if (
        typeof reference['context'] !== 'string' ||
        typeof reference['source'] !== 'object' ||
        typeof reference['target'] !== 'object'
      ) {
        return false;
      }
      if (
        Record.verifDirectionArray(reference['source']) === false ||
        Record.verifDirectionArray(reference['target']) === false
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Direction} direction
   * @returns {boolean}
   */

  static verifDirectionArray(direction) {
    if (!direction['id'] || !direction['title'] || !direction['type']) {
      return false;
    }
    if (isNaN(direction['id'])) {
      return false;
    }
    return true;
  }

  /**
   * Generate a record,
   * a named dataset, with references to others, validated from a configuration
   * @param {string} id - Unique identifier of the record.
   * @param {string} title - Title of the record.
   * @param {string[]} [type=['undefined']] - Type of the record, registred into the config.
   * @param {string | string[]} tags - List of tags of the record.
   * @param {object} metas - Metas to add to Front Matter.
   * @param {string} content - Text content if the record.
   * @param {Reference[]} links - Link, to others records.
   * @param {Reference[]} backlinks - Backlinks, from others records.
   * @param {number} begin - Timestamp.
   * @param {number} end - Timestamp.
   * @param {BibliographicRecord[]} bibliographicRecords
   * @param {string} thumbnail - Image path
   * @param {object} opts
   */

  constructor(
    id = Record.generateId(),
    title,
    types = ['undefined'],
    tags = [],
    metas = {},
    content = '',
    links = [],
    backlinks = [],
    begin,
    end,
    bibliographicRecords = [],
    thumbnail,
    opts
  ) {
    this.id = id;
    this.title = title;
    this.types = types;
    this.tags = tags;
    this.content = content;
    this.bibliographicRecords = bibliographicRecords;
    this.bibliography = '';
    this.thumbnail = thumbnail;

    if (tags) {
      if (Array.isArray(tags)) {
        tags = tags.filter((tag) => !!tag);
        this.tags = tags.length === 0 ? [] : tags;
      } else {
        this.tags = tags.split(',').filter((str) => str !== '');
      }
    }

    const config = new Config(opts);
    const typesRecords = config.getTypesRecords();
    const typesLinks = config.getTypesLinks();
    const recordMetas = config.getRecordMetas();

    this.types = this.types.map((type) => {
      if (typesRecords.has(type)) {
        return type;
      }
      new Report(this.id, this.title, 'warning').aboutRecordTypeChange(this.title, type);
      return 'undefined';
    });
    if (this.types.length === 0) {
      this.types = ['undefined'];
    } else {
      this.types = Array.from(new Set(this.types));
    }

    metas = Object.entries(metas)
      .filter(([key, value]) => {
        if (recordMetas.has(key)) {
          return true;
        }
        new Report(this.id, this.title, 'warning').aboutIgnoredRecordMeta(this.title, key);
        return false;
      })
      .filter(([key, value]) => {
        if (value !== null) {
          return true;
        }
        new Report(this.id, this.title, 'warning').aboutNullRecordMeta(this.title, key);
        return false;
      });
    this.metas = Object.fromEntries(metas);

    this.ymlFrontMatter = this.getYamlFrontMatter();

    this.links = links;
    this.backlinks = backlinks;
    this.begin;
    if (begin) {
      const beginUnix = new Date(begin).getTime() / 1000;
      if (isNaN(beginUnix)) {
        new Report(this.id, this.title, 'error').aboutInvalidRecordTimeBegin(this.title, begin);
      } else {
        this.begin = beginUnix;
      }
    }
    this.end;
    if (end) {
      const endUnix = new Date(end).getTime() / 1000;
      if (isNaN(endUnix)) {
        new Report(this.id, this.title, 'error').aboutInvalidRecordTimeEnd(this.title, end);
      } else {
        this.end = endUnix;
      }
    }

    this.links = this.links.map((link) => {
      if (typesLinks.has(link.type)) {
        return link;
      }
      new Report(this.id, this.title, 'warning').aboutLinkTypeChange(
        this.title,
        link.target.id,
        link.type
      );
      link.type = 'undefined';
      return link;
    });

    this.config = config;
    /**
     * Invalid fields
     * @type array
     */
    this.report = [];

    this.verif();
  }

  getYamlFrontMatter() {
    const bibliographicIds = this.bibliographicRecords.map(({ ids }) => Array.from(ids)).flat();
    const ymlContent = yml.stringify({
      title: this.title,
      id: this.id,
      types: this.types,
      tags: this.tags.length === 0 ? undefined : this.tags,
      references: bibliographicIds.length === 0 ? undefined : bibliographicIds,
      thumbnail: this.thumbnail,
      ...this.metas,
    });
    const frontMatterPlainText = ['---\n', ymlContent, '---\n\n'].join('');
    return frontMatterPlainText;
  }

  /**
   * The keys like '[@Goody_1979, 12]' are remplace, as (Goody 1979 p. 12)
   * and assign this.bibliography with HTML
   * @param {Bibliography} bibliography
   */

  replaceBibliographicText(bibliography) {
    if (!bibliography || bibliography instanceof Bibliography === false) {
      throw new Error('Need instance of Bibliography to process');
    }
    const bibliographyHtml = new Set();
    for (const bibliographicRecord of this.bibliographicRecords) {
      const { record, cluster, unknowedIds } = bibliography.get(bibliographicRecord);
      for (const id of unknowedIds) {
        new Report(this.id, this.title, 'error').aboutUnknownBibliographicReference(this.title, id);
      }
      bibliographyHtml.add(record);
      const { text } = bibliographicRecord;
      if (!text) {
        continue;
      }
      let regex = '\\[' + text.substring(1, text.length - 1) + '\\]';
      regex = new RegExp(regex, 'g');
      this.content = this.content.replace(regex, cluster);
      this.links.map((link) => {
        link.context = link.context.map((paraph) => paraph.replace(regex, cluster));
      });
      this.backlinks.map((link) => {
        link.context = link.context.map((paraph) => paraph.replace(regex, cluster));
      });
    }
    this.bibliography = Array.from(bibliographyHtml).join('\n');
  }

  /**
   * Save the record to the config 'files_origin' path option
   * @param {boolean} force - If can overwrite
   * @param {string} fileName
   * @return {Promise}
   */

  saveAsFile(force = false, fileName = this.title) {
    return new Promise((resolve, reject) => {
      try {
        if (this.isValid() === false) {
          throw new ErrorRecord(this.writeReport(), 'report');
        }
        if (this.config.canSaveRecords() === false) {
          throw new ErrorRecord('Directory for record save is unset', 'no dir');
        }

        this.fileName = Record.getSlugFileName(fileName);
        this.path = path.join(this.config.opts.files_origin, this.fileName);

        if (this.willOverwrite() === true && force === false) {
          throw new ErrorRecord(lang.getFor(lang.i.record.errors['overwriting']), 'overwriting');
        }

        const contentToSave = this.ymlFrontMatter + this.content;
        fs.writeFile(this.path, contentToSave, (err) => {
          if (err) {
            throw new ErrorRecord(err, 'fs error');
          }
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Store invalid fields into this.report
   */

  verif() {
    if (!this.title) {
      this.report.push('title');
    }

    if (isNaN(this.id)) {
      this.report.push('id');
    }

    // if (this.links !== undefined && Record.verifReferenceArray(this.links) === false) {
    //     this.report.push('links'); }

    // if (this.backlinks !== undefined && Record.verifReferenceArray(this.backlinks) === false) {
    //     this.report.push('backlinks'); }
  }

  /**
   * Check 'this.report' array.
   * If it is empty : TRUE
   * @returns {boolean}
   */

  isValid() {
    if (this.report.length === 0) {
      return true;
    }

    return false;
  }

  /**
   * Tranform 'this.report' array (contains error list) to a string
   * @returns {string}
   */

  writeReport() {
    return this.report
      .map((invalidField) => {
        return lang.getFor(lang.i.record.errors[invalidField]);
      })
      .join(', ');
  }

  /**
   * Verif if a file already exist with this name
   * @return {boolean}
   */

  willOverwrite() {
    if (fs.existsSync(this.path)) {
      return true;
    }

    return false;
  }
};

class ErrorRecord extends Error {
  /**
   * @param {string} message
   * @param {'report'|'overwritting'|'fs error'|'no dir'} type
   */
  constructor(message, type) {
    super(message);
    this.name = 'Error Record';
    this.type = type;
  }
}
