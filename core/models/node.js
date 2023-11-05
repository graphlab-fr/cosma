/**
 * @file Define node pattern
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const { scaleLinear } = require('d3-scale');

const Config = require('./config');

module.exports = class Node {
  /**
   * @param {number} linksNb
   * @param {number} backlinksNb
   * @param {[number, number]} linksExtent
   * @param {[number, number]} backlinksExtent
   * @param {number} minRange
   * @param {number} maxRange
   * @returns
   */

  static getNodeSizeByLinkRank(
    linksNb,
    backlinksNb,
    linksExtent,
    backlinksExtent,
    minRange,
    maxRange,
  ) {
    const [minLinks, maxLinks] = linksExtent;
    const [minBacklinks, maxBacklinks] = backlinksExtent;

    var size = scaleLinear()
      .domain([minLinks + minBacklinks, maxLinks + maxBacklinks])
      .range([minRange, maxRange]);

    return size(linksNb + backlinksNb);
  }

  /**
   * @param {Config} config
   * @param {string} nodeType
   * @param {string} thumbnail
   * @returns {object}
   */

  static getNodeStyle(config, nodeType, thumbnail) {
    if (!config || config instanceof Config === false) {
      throw new Error('Need instance of Config to process');
    }
    const format = config.getFormatOfTypeRecord(nodeType);
    let fill;
    switch (format) {
      case 'image':
        fill = `url(#${config.opts['record_types'][nodeType]['fill']})`;
        break;
      case 'color':
      default:
        fill = config.opts['record_types'][nodeType]['fill'];
        break;
    }

    if (thumbnail) {
      fill = `url(#${thumbnail})`;
    }

    return {
      fill,
      colorStroke: config.opts['record_types'][nodeType]['stroke'],
      highlight: config.opts['graph_highlight_color'],
    };
  }

  /**
   * @param {Record[]} records
   * @param {Graph.stats} graphStats
   * @returns {Node[]}
   */

  static getNodesFromRecords(records, { linksExtent, backlinksExtent }) {
    return records.map((record) => {
      const { id, title, types, links, backlinks, begin, end, thumbnail, config } = record;
      const { fill, colorStroke, highlight } = Node.getNodeStyle(config, types[0], thumbnail);
      const { node_size_method, node_size, node_size_min, node_size_max } = config.opts;
      let size;
      switch (node_size_method) {
        case 'unique':
          size = node_size;
          break;
        case 'degree':
          size = Node.getNodeSizeByLinkRank(
            links.length,
            backlinks.length,
            linksExtent,
            backlinksExtent,
            node_size_min,
            node_size_max,
          );
          break;
      }
      return new Node(id, title, types, fill, colorStroke, highlight, size, 2, begin, end);
    });
  }

  /**
   * @param {string} id
   * @param {string} label
   * @param {string} type
   * @param {string} fill Color of the center
   * @param {string} colorStroke Color of the border
   * @param {string} colorHighlight Color on highlight
   * @param {number} size
   * @param {number} strokeWidth
   * @param {array} focus
   * @param {number} begin
   * @param {number} end
   */

  constructor(
    id,
    label,
    types = ['undefined'],
    fill,
    colorStroke,
    highlight,
    size,
    strokeWidth,
    begin,
    end,
  ) {
    this.id = id;
    this.label = label;
    this.types = types;
    this.fill = fill;
    this.colorStroke = colorStroke;
    this.highlight = highlight;
    this.size = Number(size);
    this.strokeWidth = strokeWidth;
    this.begin = begin;
    this.end = end;
  }
};

/**
 * Delete duplicated elements from an array
 * @param {array} array - Array with duplicated elements
 * @return {array} - Array without duplicated elements
 */

function deleteDupicates(array) {
  if (array.length < 2) {
    return array;
  }

  return array.filter((item, index) => {
    return array.indexOf(item) === index;
  });
}
