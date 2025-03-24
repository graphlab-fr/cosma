import GraphEngine from 'graphology';
import { scaleLinear } from 'd3';
import Config from '../models/config';
import slugify from './slugify';

/**
 * @typedef BrokenEdge
 * @type {object}
 * @property {string} source
 * @property {string} target
 */

/**
 * @typedef Node
 * @type {object}
 * @property {string} label
 * @property {string} types
 * @property {string} thumbnail
 * @property {number} begin
 * @property {number} end
 */

/**
 * @typedef LinkShape
 * @type {object}
 * @property {string} stroke
 * @property {string} dashInterval
 */

/**
 * @typedef Edge
 * @type {object}
 * @property {string} type
 * @property {LinkShape} shape
 */

/**
 * @param {number} degree
 * @param {number} minDegree
 * @param {number} maxDegree
 * @param {Config} config
 * @returns {number}
 */

function getNodeSize(degree, minDegree, maxDegree, config) {
  switch (config.opts['node_size_method']) {
    case 'unique':
      return config.opts['node_size'];
    case 'degree':
      const compute = scaleLinear()
        .domain([minDegree, maxDegree])
        .range([config.opts['node_size_min'], config.opts['node_size_max']]);

      const size = compute(degree);
      // round at most two decimals
      return Math.round(size * 100) / 100;
  }
}

/**
 * @param {string} linkType
 * @param {Config} config
 * @returns {{ stroke: string, dashInterval: string | null }}
 */

function getLinkShape(linkType, config) {
  const linkTypeConfig = config.opts.link_types[linkType];
  const stroke = linkTypeConfig?.stroke || 'simple';

  switch (stroke) {
    case 'simple':
      return { stroke: stroke, dashInterval: null };
    case 'double':
      return { stroke: stroke, dashInterval: null };
    case 'dash':
      return { stroke: stroke, dashInterval: '4, 5' };
    case 'dotted':
      return { stroke: stroke, dashInterval: '1, 3' };
  }
  return { stroke: 'simple', dashInterval: null };
}

/**
 *
 * @param {Map<string, import('../models/record').default>} records
 * @param {import('../models/config').default} config
 * @returns {{ graph: GraphEngine<Node, Edge>, brokenEdges: BrokenEdge[] }}
 */

export default function getGraph(records, config) {
  /** @type {GraphEngine<Node, Edge>} */
  const graph = new GraphEngine({ multi: true }, config.opts);
  /** @type {BrokenEdge[]} */
  const brokenEdges = [];

  records.forEach((record) => {
    graph.addNode(record.id, {
      label: record.title,
      types: record.types,
      thumbnail: record.thumbnail,
      begin: record.begin,
      end: record.end,
    });
  });

  records.forEach((record) => {
    record.links.forEach((link) => {
      if (!graph.hasNode(link.target)) {
        brokenEdges.push({
          source: record.id,
          target: link.target,
        });
        return;
      }

      graph.addDirectedEdge(record.id, link.target, {
        type: slugify(link.type),
        shape: getLinkShape(link.type, config),
      });
    });
  });

  const degrees = graph.mapNodes((node) => graph.degree(node));
  const minDegree = Math.min(...degrees);
  const maxDegree = Math.max(...degrees);

  graph.updateEachNodeAttributes((node, attr) => {
    const size = getNodeSize(graph.degree(node), minDegree, maxDegree, config);
    return {
      ...attr,
      size,
    };
  });

  return { graph, brokenEdges };
}
