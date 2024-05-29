/**
 * @file Graph pattern
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

/**
 * @typedef Timeline
 * @type {object}
 * @property {number | undefined} begin
 * @property {number | undefined} end
 */

/**
 * @typedef Folksonomy
 * @type {object}
 * @property {object} tags
 * @property {object} metas
 */

const { extent } = require('d3-array');

const Config = require('./config'),
  Record = require('./record'),
  Link = require('./link'),
  Node = require('./node'),
  Report = require('./report');

module.exports = class Graph {
  static validParams = new Set(['sample', 'fake', 'empty']);

  /**
   *
   * @param {Record[]} records
   * @param {Config.opts} opts
   * @param {string[]} params
   * @exemple
   * ```
   * const { files_origin: filesPath } = Config.get();
   * const files = Cosmoscope.getFromPathFiles(filesPath);
   * const records = Cosmoscope.getRecordsFromFiles(files, true, config.opts);
   * const graph = new Cosmocope(records, config.opts, ['sample']);
   * ```
   */

  constructor(records = [], opts = {}, params = []) {
    this.params = new Set(params.filter((param) => Graph.validParams.has(param)));
    this.records = records;

    this.stats = {
      linksExtent: extent(this.records, (d) => d.links.length),
      backlinksExtent: extent(this.records, (d) => d.backlinks.length),
    };

    this.data = {
      nodes: Node.getNodesFromRecords(this.records, this.stats),
      links: Link.getLinksFromRecords(this.records),
    };
    this.config = new Config(opts);

    this.reportDuplicatedIds();
  }

  /**
   * Check if ids are all unique and report duplicated ones
   */

  reportDuplicatedIds() {
    const recordsIdAlreadyAnalysed = new Set();
    let lastRecordTitle;
    for (const { id, title } of this.records) {
      if (recordsIdAlreadyAnalysed.has(id)) {
        new Report(id, title, 'error').aboutDuplicatedIds(id, title, lastRecordTitle);
      }
      recordsIdAlreadyAnalysed.add(id);
      lastRecordTitle = title;
    }
  }

  /**
   * Get timestamps begin and end for timeline,
   * based on most recent and oldest node
   * @returns {Timeline}
   */

  getTimelineFromRecords() {
    let dates = [];
    for (const { begin, end } of this.records) {
      dates.push(begin, end);
    }
    const [begin, end] = extent(dates);
    return {
      begin,
      // Add margin of one second to display oldest node at end of timeline
      end: end + 1,
    };
  }

  /**
   * @returns {Map<string, Set<string>}
   */

  getTypesFromRecords() {
    const typesList = new Map();
    for (const { types, id } of this.records) {
      for (const type of types) {
        if (typesList.has(type)) {
          typesList.get(type).add(id);
        } else {
          typesList.set(type, new Set([id]));
        }
      }
    }
    return typesList;
  }

  /**
   * @returns {Map<string, Set<string>}
   */

  getTagsFromRecords() {
    const tagsList = new Map();
    for (const { tags, id } of this.records) {
      for (const tag of tags) {
        if (tagsList.has(tag)) {
          tagsList.get(tag).add(id);
        } else {
          tagsList.set(tag, new Set([id]));
        }
      }
    }
    return tagsList;
  }

  /**
   * @returns {Map<string, Set<string>}
   */

  getMetasFromRecords() {
    const metasList = new Map();
    for (const { metas } of this.records) {
      for (const [meta, value] of Object.entries(metas)) {
        if (metasList.has(meta)) {
          metasList.get(meta).add(value);
        } else {
          metasList.set(meta, new Set([value]));
        }
      }
    }
    return metasList;
  }

  /**
   * Get graph tags and metas as arrays.
   * @returns {string}
   */

  getFolksonomyAsObjectOfArrays() {
    let folksonomy = {
      tags: Object.fromEntries(this.getTagsFromRecords()),
      metas: Object.fromEntries(this.getMetasFromRecords()),
    };
    folksonomy = JSON.stringify(folksonomy, (key, value) =>
      value instanceof Set ? Array.from(value) : value,
    );
    return JSON.parse(folksonomy);
  }
};
