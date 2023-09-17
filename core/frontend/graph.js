/**
 * @typedef NodeNetwork
 * @type {object}
 * @property {d3.Selection<SVGGElement, Node, SVGElement>} nodes
 * @property {d3.Selection<SVGLineElement, Link, SVGElement>} links
 */

import * as d3 from 'd3';

import View from './view';
import { hideFromIndex, displayFromIndex } from './records';
import { setCounters } from './counter';
import hotkeys from 'hotkeys-js';
import filterPriority from './filterPriority';

/** Data serialization
------------------------------------------------------------*/

const allNodeIds = [];

data.nodes = data.nodes.map((node) => {
  allNodeIds.push(node.id);
  node.hidden = filterPriority.notFiltered;
  node.isolated = false;
  node.highlighted = false;
  return node;
});

/** Box sizing
------------------------------------------------------------*/

const svg = d3.select('#graph-canvas');
const svgSub = svg.append('svg');

const { width, height } = svg.node().getBoundingClientRect();

svgSub.attr('viewBox', [0, 0, width, height]).attr('preserveAspectRatio', 'xMinYMin meet');

/** Force simulation
------------------------------------------------------------*/

const simulation = d3
  .forceSimulation(data.nodes)
  .force(
    'link',
    d3.forceLink(data.links).id((d) => d.id),
  )
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter())
  .force('forceX', d3.forceX())
  .force('forceY', d3.forceY());

simulation
  .force('center')
  .x(width * 0.5)
  .y(height * 0.5);

window.updateForces = function () {
  // get each force by name and update the properties

  simulation
    .force('charge')
    // turn force value to negative number
    .strength(-Math.abs(graphProperties.attraction_force))
    .distanceMax(graphProperties.attraction_distance_max);

  simulation.force('forceX').strength(graphProperties.attraction_vertical);

  simulation.force('forceY').strength(graphProperties.attraction_horizontal);

  // restarts the simulation
  simulation.alpha(1).restart();
};

updateForces();

hotkeys('space', (e) => {
  e.preventDefault();
  updateForces();
});

simulation.on('tick', function () {
  elts.links
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);

  elts.nodes.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

  d3.select('#load-bar-value').style('flex-basis', simulation.alpha() * 100 + '%');

  translate();
});

/** Elements
------------------------------------------------------------*/

const elts = {};

/** @type {d3.Selection<SVGLineElement, Link, SVGElement, any>} */
elts.links = svgSub
  .append('g')
  .selectAll('line')
  .data(data.links)
  .enter()
  .append('line')
  .attr('stroke', (d) => d.color)
  .attr('title', (d) => d.title)
  .attr('data-source', (d) => d.source.id)
  .attr('data-target', (d) => d.target.id)
  .attr('stroke-dasharray', function (d) {
    if (d.shape.stroke === 'dash' || d.shape.stroke === 'dotted') {
      return d.shape.dashInterval;
    }
    return false;
  })
  .attr('filter', function (d) {
    if (d.shape.stroke === 'double') {
      return 'url(#double)';
    }
    return false;
  });

if (graphProperties.graph_arrows === true) {
  elts.links.attr('marker-end', 'url(#arrow)');
}

/** @type {d3.Selection<SVGGElement, Node, SVGElement, any>} */
elts.nodes = svgSub
  .append('g')
  .selectAll('g')
  .data(data.nodes)
  .enter()
  .append('g')
  .attr('data-node', (d) => d.id)
  .append('a')
  .attr('href', (d) => '#' + d.id);

/** @type {d3.Selection<SVGCircleElement, any, SVGElement, any>} */
elts.circles = elts.nodes
  .append('circle')
  .attr('r', (d) => d.size)
  .attr('fill', (d) => d.fill)
  .attr('stroke', (d) => d.colorStroke)
  .attr('stroke-width', (d) => d.strokeWidth)
  .call(
    d3
      .drag()
      .on('start', function (d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', function (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', function (d) {
        if (!d3.event.active) simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
      }),
  )
  .on('mouseenter', function (nodeMetas) {
    if (!graphProperties.graph_highlight_on_hover) {
      return;
    }

    let nodesIdsHovered = [nodeMetas.id];

    const linksToModif = elts.links.filter(function (link) {
      if (link.source.id === nodeMetas.id || link.target.id === nodeMetas.id) {
        nodesIdsHovered.push(link.source.id, link.target.id);
        return false;
      }
      return true;
    });

    const nodesToModif = elts.nodes.filter(function (node) {
      if (nodesIdsHovered.includes(node.id)) {
        return false;
      }
      return true;
    });

    const linksHovered = elts.links.filter(function (link) {
      if (link.source.id !== nodeMetas.id && link.target.id !== nodeMetas.id) {
        return false;
      }
      return true;
    });

    const nodesHovered = elts.nodes.filter(function (node) {
      if (!nodesIdsHovered.includes(node.id)) {
        return false;
      }
      return true;
    });

    nodesHovered.selectAll('circle').attr('stroke', (d) => d.highlight);
    linksHovered.attr('stroke', (d) => d.colorHighlight);
    nodesToModif.attr('opacity', 0.5);
    linksToModif.attr('stroke-opacity', 0.5);
  })
  .on('mouseout', function () {
    if (!graphProperties.graph_highlight_on_hover) {
      return;
    }

    elts.nodes.selectAll('circle').attr('stroke', (d) => d.colorStroke);
    elts.links.attr('stroke', (d) => d.color);
    elts.nodes.attr('opacity', 1);
    elts.links.attr('stroke-opacity', 1);
  });

/** @type {d3.Selection<SVGTextElement, Node, SVGGElement, any>} */
elts.labels = elts.nodes
  .append('text')
  .each(function (d) {
    const words = d.label.split(' '),
      max = 25,
      text = d3.select(this);
    let label = '';

    for (let i = 0; i < words.length; i++) {
      // combine words and seperate them by a space caracter into label
      label += words[i] + ' ';

      // if label (words combination) is longer than max & not the single iteration
      if (label.length < max && i !== words.length - 1) {
        continue;
      }

      text.append('tspan').attr('x', 0).attr('dy', '1.2em').text(label.slice(0, -1)); // remove last space caracter

      label = '';
    }
  })
  .attr('font-size', graphProperties.graph_text_size)
  .attr('x', 0)
  .attr('y', (d) => d.size)
  .attr('dominant-baseline', 'middle')
  .attr('text-anchor', 'middle');

/** Functions
------------------------------------------------------------*/

/**
 * Get nodes and their links
 * @param {array} nodeIds - List of nodes ids
 * @returns {NodeNetwork} - DOM elts : nodes and their links
 */

function getNodeNetwork(nodeIds) {
  const diplayedNodes = elts.nodes
    .filter((item) => item.hidden === filterPriority.notFiltered)
    .data()
    .map((item) => item.id);

  const nodes = elts.nodes.filter((node) => nodeIds.includes(node.id));

  const links = elts.links.filter(function (link) {
    if (!nodeIds.includes(link.source.id) && !nodeIds.includes(link.target.id)) {
      return false;
    }
    if (!diplayedNodes.includes(link.source.id) || !diplayedNodes.includes(link.target.id)) {
      return false;
    }

    return true;
  });

  return {
    nodes,
    links,
  };
}

function setNodesDisplaying(nodeIds, priority) {
  const toHide = [],
    toDisplay = [];

  allNodeIds.forEach((id) => {
    if (nodeIds.includes(id)) {
      toDisplay.push(id);
    } else {
      toHide.push(id);
    }
  });

  hideNodes(toHide, priority);
  displayNodes(toDisplay, priority);
}

/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodes(nodeIds, priority) {
  hideNodeNetwork(nodeIds);
  hideFromIndex(nodeIds);

  if (priority === undefined) {
    throw new Error('Need priority');
  }

  elts.nodes.data().map((node) => {
    const { id, hidden } = node;
    if (nodeIds.includes(id) && hidden <= priority) {
      node.hidden = priority;
    }
    return node;
  });
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds, priority = filterPriority.notFiltered) {
  const nodesToDisplayIds = [];

  elts.nodes.data().map((node) => {
    const { id, hidden } = node;
    if (nodeIds.includes(id) && hidden <= priority) {
      nodesToDisplayIds.push(id);
      node.hidden = filterPriority.notFiltered;
    }
    return node;
  });

  displayNodeNetwork(nodesToDisplayIds);
  displayFromIndex(nodesToDisplayIds);
}

function displayNodesAll(priority = filterPriority.notFiltered) {
  displayNodes(allNodeIds, priority);
}

function hideNodesAll(priority = filterPriority.notFiltered) {
  hideNodes(allNodeIds, priority);
}

/**
 * Zoom to a node from its coordinates
 * @param {string|number} nodeId
 */

window.zoomToNode = function (nodeId) {
  let { x, y } = elts.nodes.filter((node) => node.id === nodeId).datum(),
    zoom = 2;

  x = -Math.abs(x - 200);
  y = -Math.abs(y - 300);

  View.position = { x, y, zoom };

  translate();
};

hotkeys('c', (e) => {
  e.preventDefault();
  if (View.openedRecordId) {
    zoomToNode(Number(View.openedRecordId));
  }
});

/**
 * Display none nodes and their link
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

window.hideNodeNetwork = function (nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.style('display', 'none');
  links.style('display', 'none');
};

/**
 * Reset display nodes and their link
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

window.displayNodeNetwork = function (nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.style('display', null);
  links.style('display', null);
};

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.selectAll('circle').style('stroke', 'var(--highlight)');
  links.style('stroke', 'var(--highlight)');

  View.highlightedNodes = View.highlightedNodes.concat(nodeIds);
}

/**
 * remove highlightColor from all highlighted nodes and their links
 */

function unlightNodes() {
  if (View.highlightedNodes.length === 0) {
    return;
  }

  const { nodes, links } = getNodeNetwork(View.highlightedNodes);

  nodes.selectAll('circle').style('stroke', null);
  links.style('stroke', null);

  View.highlightedNodes = [];
}

/**
 * Toggle display/hide nodes links
 * @param {boolean} isChecked - 'checked' value send by a checkbox input
 */

window.linksDisplayToggle = function (isChecked) {
  if (isChecked) {
    elts.links.style('display', null);
  } else {
    elts.links.style('display', 'none');
  }
};

/**
 * Toggle display/hide nodes label
 * @param {boolean} isChecked - 'checked' value send by a checkbox input
 */

window.labelDisplayToggle = function (isChecked) {
  if (isChecked) {
    elts.labels.style('display', null);
  } else {
    elts.labels.style('display', 'none');
  }
};

/**
 * Add 'highlight' class to texts linked to nodes ids
 * @param {string[]|number[]} nodeIds - List of node ids
 */

window.labelHighlight = function (nodeIds) {
  elts.nodes.data().map((node) => {
    if (nodeIds.includes(node.id)) {
      node.highlighted = true;
    }
    return node;
  });

  elts.nodes
    .filter((node) => nodeIds.includes(node.id))
    .select('text')
    .style('fill', 'var(--highlight)');
};

/**
 * Change the font size of graph labels
 */

window.updateFontsize = function () {
  elts.labels.attr('font-size', graphProperties.text_size);
};

/**
 * Remove 'highlight' class from texts linked to nodes ids
 * @param {string[]|number[]} nodeIds - List of node ids
 */

window.labelUnlight = function (nodeIds) {
  elts.nodes.data().map((node) => {
    if (nodeIds.includes(node.id)) {
      node.highlighted = false;
    }
    return node;
  });

  elts.nodes
    .filter((node) => nodeIds.includes(node.id))
    .select('text')
    .style('fill', null);
};

/**
 * Remove 'highlight' class from all texts
 */

window.labelUnlightAll = function () {
  data.nodes = data.nodes.map(function (node) {
    node.highlighted = false;
    return node;
  });

  elts.labels.style('fill', null);
};

function translate() {
  const minX = d3.min(data.nodes, (d) => d.x);
  const maxX = d3.max(data.nodes, (d) => d.x);
  const minY = d3.min(data.nodes, (d) => d.y);
  const maxY = d3.max(data.nodes, (d) => d.y);

  const { x, y, zoom } = View.position;

  svgSub
    .attr('viewBox', [minX - x, minY - y, maxX - minX / zoom, maxY - minY / zoom])
    .attr('preserveAspectRatio', 'xMinYMin meet');
}

const nodes = elts.nodes.data();
const links = elts.links.data();

export {
  svg,
  svgSub,
  hideNodes,
  hideNodesAll,
  displayNodes,
  displayNodesAll,
  setNodesDisplaying,
  highlightNodes,
  unlightNodes,
  translate,
  nodes,
  links,
};
