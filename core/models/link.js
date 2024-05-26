/**
 * @file Link (link in graph) pattern
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import Config from './config.js';
import Report from './report.js';

/**
 * @typedef Shape
 * @type {object}
 * @property {'simple' | 'double' | 'dotted' | 'dash'} stroke Display as a title
 * @property {string | null} dashInterval Display as a body text
 */

/**
 * @typedef LinkNormalized
 * @type {object}
 * @property {string} type
 * @property {object} target
 * @property {number} target.id
 */

/**
 * @typedef FormatedLinkData
 * @type {object}
 * @property {number} source
 * @property {number} target
 * @property {string} label
 */

class Link {
  /**
   * List of valid values for the links stroke
   * Apply to config form
   * @type {Set}
   * @static
   */

  static validLinkStrokes = new Set(['simple', 'double', 'dotted', 'dash']);

  /** @type {Shape} */

  static baseShape = { stroke: 'simple', dashInterval: null };

  static regexParagraph = new RegExp(/[^\r\n]+((\r|\n|\r\n)[^\r\n]+)*/, 'g');

  /** @exemple `"[[a:20210424214230|link text]]"` */
  static regexWikilink = new RegExp(
    /\[\[((?<type>[^:|\]]+?):)?(?<id>.+?)(\|(?<text>.+?))?\]\]/,
    'g',
  );

  /**
   * @param {File.metas.id} fileId
   * @param {File.content} fileContent
   * @returns {Link[]}
   * @exemple
   * ```
   * getWikiLinksFromFileContent(1, "Lorem [[20210531145255]] ipsum")
   * ```
   */

  static getWikiLinksFromFileContent(fileId, fileContent) {
    const links = {};

    let match;
    while ((match = Link.regexWikilink.exec(fileContent))) {
      const { type, text } = match.groups;
      const targetId = match.groups.id.toLowerCase();
      links[targetId] = { type, targetId, text, context: new Set() };
    }

    let paraphs = fileContent.match(Link.regexParagraph) || [];

    for (const paraph of paraphs) {
      let match;
      while ((match = Link.regexWikilink.exec(paraph))) {
        // const { id: targetId } = match.groups;
        const targetId = match.groups.id.toLowerCase();
        links[targetId].context.add(paraph);
      }
    }

    return Object.values(links).map(({ type, targetId, text, context }) => {
      return new Link(
        undefined,
        Array.from(context),
        type || 'undefined',
        undefined,
        undefined,
        undefined,
        fileId,
        targetId,
      );
    });
  }

  /**
   *
   * @param {Config.opts} configOpts
   * @param {string} linkType
   * @returns {object}
   */

  static getLinkStyle(configOpts, linkType) {
    const linkTypeConfig = configOpts.link_types[linkType];
    let stroke, color;

    if (linkTypeConfig) {
      stroke = linkTypeConfig.stroke;
      color = linkTypeConfig.color;
    } else {
      stroke = 'simple';
      color = null;
    }

    switch (stroke) {
      case 'simple':
        return { shape: { stroke: stroke, dashInterval: null }, color: color };

      case 'double':
        return { shape: { stroke: stroke, dashInterval: null }, color: color };

      case 'dash':
        return { shape: { stroke: stroke, dashInterval: '4, 5' }, color: color };

      case 'dotted':
        return { shape: { stroke: stroke, dashInterval: '1, 3' }, color: color };
    }

    // default return
    return { shape: { stroke: 'simple', dashInterval: null }, color: color };
  }

  /**
   * @param {string} nodeId
   * @param {Link[]} links
   * @param {Node[]} nodes
   * @returns {Reference[]}
   * @static
   */

  static getReferencesFromLinks(nodeId, links, nodes) {
    const linksFromNodeReferences = links
      .filter(({ source }) => source === nodeId)
      .map(({ context, type, source: sourceId, target: targetId }) => {
        const nodeTarget = nodes.find((n) => n.id === targetId);
        const nodeSource = nodes.find((n) => n.id === sourceId);
        if (!nodeTarget || !nodeSource) {
          new Report(nodeSource.id, nodeSource.label, 'error').aboutBrokenLinks(
            nodeSource.label,
            context,
          );
          return undefined;
        }
        const { label: targetLabel, types: targetTypes } = nodeTarget;
        const { label: sourceLabel, types: sourceTypes } = nodeSource;
        return {
          context,
          type,
          source: {
            id: sourceId,
            title: sourceLabel,
            types: sourceTypes,
          },
          target: {
            id: targetId,
            title: targetLabel,
            types: targetTypes,
          },
        };
      })
      .filter((link) => link !== undefined);
    const backlinksToNodeReferences = links
      .filter(({ target }) => target === nodeId)
      .map(({ context, type, source: sourceId, target: targetId }) => {
        const nodeTarget = nodes.find((n) => n.id === targetId);
        const nodeSource = nodes.find((n) => n.id === sourceId);
        if (!nodeTarget || !nodeSource) {
          return undefined;
        }
        const { label: targetLabel, types: targetTypes } = nodeTarget;
        const { label: sourceLabel, types: sourceTypes } = nodeSource;
        return {
          context,
          type,
          source: {
            id: sourceId,
            title: sourceLabel,
            types: sourceTypes,
          },
          target: {
            id: targetId,
            title: targetLabel,
            types: targetTypes,
          },
        };
      })
      .filter((link) => link !== undefined);
    return {
      linksReferences: linksFromNodeReferences,
      backlinksReferences: backlinksToNodeReferences,
    };
  }

  /**
   * @param {Record[]} records
   * @returns {Link[]}
   */

  static getLinksFromRecords(records) {
    const linksFromRecord = [];
    let id = 0;
    for (const { links, config } of records) {
      const { opts } = config;
      for (const { context, type, source, target } of links) {
        const { shape, color } = Link.getLinkStyle(opts, type);
        linksFromRecord.push(
          new Link(
            id,
            context,
            type,
            shape,
            color,
            opts['graph_highlight_color'],
            source.id,
            target.id,
          ),
        );
        id++;
      }
    }
    return linksFromRecord;
  }

  /**
   * Get data from a fromated CSV line
   * @param {object} line
   * @return {FormatedLinkData}
   */

  static getFormatedDataFromCsvLine({ source, target, label }) {
    return { source, target, label };
  }

  /**
   * @param {FormatedLinkData[]} data
   * @returns {Link[]}
   */

  static formatedDatasetToLinks(data) {
    return data.map(({ label, source, target }, i) => {
      if (label) {
        label = [label];
      }

      const link = new Link(i, label, 'undefined', undefined, undefined, undefined, source, target);

      if (link.isValid()) {
        return link;
      }
      return undefined;
    });
  }

  /**
   * @param {number} id
   * @param {string[]} context
   * @param {string} type
   * @param {Shape} [shape = Link.baseShape]
   * @param {string} color
   * @param {string} colorHighlight
   * @param {string} source
   * @param {string} target
   */

  constructor(
    id,
    context = [],
    type,
    shape = Link.baseShape,
    color,
    colorHighlight,
    source,
    target,
  ) {
    this.id = id;
    this.context = context;
    this.type = type;
    this.shape = shape;
    this.color = color;
    this.colorHighlight = colorHighlight;
    this.source = source;
    this.target = target;

    this.report = [];
  }

  verif() {
    if (!this.title) {
      this.report.push('Invalid title');
    }
    if (!this.shape || Link.validLinkStrokes.has(this.shape) === false) {
      this.report.push('Invalid shape');
    }
    if (!this.source || isNaN(this.source)) {
      this.report.push('Invalid source');
    }
    if (!this.target || isNaN(this.target)) {
      this.report.push('Invalid target');
    }
  }

  /**
   * @returns {boolean}
   */

  isValid() {
    return this.report.length === 0;
  }
}

export default Link;
