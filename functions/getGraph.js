import GraphEngine from 'graphology';
import { scaleLinear } from 'd3';
import Config from '../core/models/config';

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
 * @param {Record[]} records
 * @param {Config} config
 * @returns GraphEngine
 */

export default function getGraph(records, config) {
  const graph = new GraphEngine({ multi: true }, config.opts);

  /**
   * @param {number} degree Node degree
   * @returns {number}
   */

  records.forEach(({ id, title, types, thumbnail, begin, end }) => {
    graph.addNode(id, {
      label: title,
      types,
      thumbnail,
      begin,
      end,
    });
  });

  records.forEach(({ id: nodeId, wikilinks, bibliographicRecords }) => {
    wikilinks.forEach(({ target, type }) => {
      graph.addEdge(nodeId, target, {
        type,
        shape: getLinkShape(type, config),
      });
    });

    bibliographicRecords.forEach(({ target }) => {
      if (!graph.hasNode(nodeId) || !graph.hasNode(target)) {
        return;
      }

      return graph.addEdge(nodeId, target, {
        type: 'undefined',
        shape: getLinkShape('undefined', config),
      });
    });
  });

  const degrees = graph.nodes().map((node) => graph.degree(node));
  const minDegree = Math.min(...degrees);
  const maxDegree = Math.max(...degrees);

  graph.updateEachNodeAttributes((node, attr) => {
    const size = getNodeSize(graph.degree(node), minDegree, maxDegree, config);
    return {
      ...attr,
      size,
    };
  });

  return graph;
}
