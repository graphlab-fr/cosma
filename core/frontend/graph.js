/**
 * @typedef NodeNetwork
 * @type {object}
 * @property {d3.Selection<SVGGElement, Node, SVGElement>} nodes
 * @property {d3.Selection<SVGLineElement, Link, SVGElement>} links
 */

import * as d3 from 'd3';

import View from './view.js';
import { hideFromIndex, displayFromIndex, getRecordIdFromHash } from './records.js';
import { setCounters } from './counter.js';
import hotkeys from 'hotkeys-js';
import filterPriority from './filterPriority.js';

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

svgSub.attr('viewBox', [0, 0, width, height]);

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
const imageFileValidExtnames = new Set(['jpg', 'jpeg', 'png']);

/** @type {d3.Selection<SVGLineElement, Link, SVGElement, any>} */
elts.links = svgSub
  .append('g')
  .selectAll('line')
  .data(data.links)
  .enter()
  .append('line')
  .attr('stroke', (d) => d.color)
  .attr('title', (d) => d.title)
  .attr('data-link', (d) => d.id)
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

const strokeWidth = 2;

/** @type {d3.Selection<SVGGElement, Node, SVGElement, any>} */
elts.nodes = svgSub
  .append('g')
  .selectAll('g')
  .data(data.nodes)
  .enter()
  .append('g')
  .attr('data-node', (d) => d.id)
  .append('a')
  .attr('href', (d) => '#' + d.id)
  .call(
    d3
      .drag()
      .on('start', function (e, d) {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', function (e, d) {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on('end', function (e, d) {
        if (!e.active) simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
      }),
  )
  .on('mouseover', (e, nodeMetas) => {
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

    nodesHovered.nodes().forEach((elt) => elt.classList.add('highlight'));
    linksHovered.nodes().forEach((elt) => elt.classList.add('highlight'));
    nodesToModif.nodes().forEach((elt) => elt.classList.add('translucent'));
    linksToModif.nodes().forEach((elt) => elt.classList.add('translucent'));
  })
  .on('mouseout', () => {
    if (!graphProperties.graph_highlight_on_hover) {
      return;
    }

    const selectedNodeId = getRecordIdFromHash();

    elts.nodes
      .filter(({ id }) => {
        if (selectedNodeId) {
          return id !== selectedNodeId;
        }
        return true;
      })
      .nodes()
      .forEach((elt) => elt.classList.remove('highlight'));
    elts.links
      .filter((link) => {
        if (selectedNodeId) {
          return link.source.id !== selectedNodeId && link.target.id !== selectedNodeId;
        }
        return true;
      })
      .nodes()
      .forEach((elt) => elt.classList.remove('highlight'));
    elts.nodes.nodes().forEach((elt) => elt.classList.remove('translucent'));
    elts.links.nodes().forEach((elt) => elt.classList.remove('translucent'));
  });

/** Draw node content */

elts.nodes.each(function (d) {
  const node = d3.select(this);

  const getFill = (fill) => {
    if (imageFileValidExtnames.has(fill.split('.').at(-1))) {
      return `url(#${fill})`;
    }
    return fill;
  };

  /**
   * Append circle on node
   * @param {string} stroke Stroke color
   * @param {string} fill Fill color or image link
   * @returns {void}
   */

  const drawSimpleCircle = (stroke, fill) => {
    /** Background: color of type */
    node
      .append('circle')
      .attr('class', 'border')
      .attr('r', d.size + 2)
      .attr('fill', stroke);
    /** Foreground: circle contains color or image */
    node.append('circle').attr('r', d.size).attr('fill', fill);
  };

  if (d.thumbnail) {
    if (d.types.length === 1) {
      const type = graphProperties['record_types'][d.types[0]];
      drawSimpleCircle(type.stroke, `url(#${d.thumbnail})`);
    } else {
      generatePathCoordinatesWithBorder(d.types.length, d.size, strokeWidth).forEach(
        ({ border }, i) => {
          const type = graphProperties['record_types'][d.types[i]];
          /** Background: borders with one color per type */
          node.append('path').attr('d', border).attr('fill', type.stroke).attr('class', 'border');
        },
      );
      /** Background: neutral white color */
      node.append('circle').attr('r', d.size).attr('fill', `var(--background-gray)`);
      /** Foreground: circle contains thumbnail */
      node.append('circle').attr('r', d.size).attr('fill', `url(#${d.thumbnail})`);
    }
    return;
  }

  if (d.types.length === 1) {
    const type = graphProperties['record_types'][d.types[0]];
    drawSimpleCircle(type.stroke, getFill(type.fill));
  } else {
    generatePathCoordinatesWithBorder(d.types.length, d.size, strokeWidth).forEach(
      ({ segment, border }, i) => {
        const type = graphProperties['record_types'][d.types[i]];
        /** Background: borders with one color per type */
        node.append('path').attr('d', border).attr('fill', type.stroke).attr('class', 'border');
        /** Background: neutral white color */
        node.append('path').attr('d', segment).attr('fill', 'var(--background-gray)');
        /** Foreground: circle fragment per type with color or image */
        node.append('path').attr('d', segment).attr('fill', getFill(type.fill));
      },
    );
  }
});

/** @type {d3.Selection<SVGTextElement, Node, SVGGElement, any>} */
elts.labels = elts.nodes
  .append('text')
  .attr('class', 'label')
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

/**
 * Get values for <path d="" />, for each fragment of same circle
 * @param {number} numSegments Minimum two, to get two fragments
 * @param {number} diameter Node size
 * @param {number} borderSize
 * @returns {[string, string][]}
 */

function generatePathCoordinatesWithBorder(numSegments, diameter, borderSize) {
  const centerX = 0;
  const centerY = 0;
  const coordinatesData = [];
  const anglePerSegment = (2 * Math.PI) / numSegments;

  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * anglePerSegment;
    const endAngle = (i + 1) * anglePerSegment;

    const startX = centerX + diameter * Math.cos(startAngle);
    const startY = centerY + diameter * Math.sin(startAngle);

    const endX = centerX + diameter * Math.cos(endAngle);
    const endY = centerY + diameter * Math.sin(endAngle);

    const pathData = `M ${startX} ${startY} A ${diameter} ${diameter} 0 0 1 ${endX} ${endY} L ${centerX} ${centerY} Z`;

    // generate second path, larger than segment to become its border

    const borderStartX = centerX + (diameter + borderSize) * Math.cos(startAngle);
    const borderStartY = centerY + (diameter + borderSize) * Math.sin(startAngle);

    const borderEndX = centerX + (diameter + borderSize) * Math.cos(endAngle);
    const borderEndY = centerY + (diameter + borderSize) * Math.sin(endAngle);

    const borderPathData = `M ${borderStartX} ${borderStartY} A ${diameter + borderSize} ${
      diameter + borderSize
    } 0 0 1 ${borderEndX} ${borderEndY} L ${centerX} ${centerY} Z`;

    coordinatesData.push({
      segment: pathData,
      border: borderPathData,
    });
  }

  return coordinatesData;
}

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
 * Display none nodes and their link
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

window.hideNodeNetwork = function (nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.nodes().forEach((elt) => elt.classList.add('hide'));
  links.nodes().forEach((elt) => elt.classList.add('hide'));
};

/**
 * Reset display nodes and their link
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

window.displayNodeNetwork = function (nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.nodes().forEach((elt) => elt.classList.remove('hide'));
  links.nodes().forEach((elt) => elt.classList.remove('hide'));
};

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {
  const { nodes, links } = getNodeNetwork(nodeIds);

  nodes.nodes().forEach((elt) => elt.classList.add('highlight'));
  links.nodes().forEach((elt) => elt.classList.add('highlight'));

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

  nodes.nodes().forEach((elt) => elt.classList.remove('highlight'));
  links.nodes().forEach((elt) => elt.classList.remove('highlight'));

  View.highlightedNodes = [];
}

/**
 * Toggle display/hide nodes links
 * @param {boolean} isChecked - 'checked' value send by a checkbox input
 */

window.linksDisplayToggle = function (isChecked) {
  if (isChecked) {
    elts.links.nodes().forEach((elt) => elt.classList.remove('hide'));
  } else {
    elts.links.nodes().forEach((elt) => elt.classList.add('hide'));
  }
};

/**
 * Toggle display/hide nodes label
 * @param {boolean} isChecked - 'checked' value send by a checkbox input
 */

window.labelDisplayToggle = function (isChecked) {
  if (isChecked) {
    elts.labels.nodes().forEach((elt) => elt.classList.remove('hide'));
  } else {
    elts.labels.nodes().forEach((elt) => elt.classList.add('hide'));
  }
};

/**
 * Change the font size of graph labels
 */

window.updateFontsize = function () {
  elts.labels.attr('font-size', graphProperties.text_size);
};

function translate() {
  const minX = d3.min(data.nodes, (d) => d.x);
  const maxX = d3.max(data.nodes, (d) => d.x);
  const minY = d3.min(data.nodes, (d) => d.y);
  const maxY = d3.max(data.nodes, (d) => d.y);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const { x, y, zoom } = View.position;

  const screenMin = d3.min([screenHeight, screenWidth]);

  let viewBoxWidth = maxX - minX;
  if (viewBoxWidth < screenMin) viewBoxWidth = screenMin;
  let viewBoxHeight = maxY - minY;
  if (viewBoxHeight < screenMin) viewBoxHeight = screenMin;

  if (0 > minX || 0 > minY) {
    const viewBox = [
      (minX - x) / zoom,
      (minY - y) / zoom,
      viewBoxWidth / zoom,
      viewBoxHeight / zoom,
    ];
    svgSub.attr('viewBox', viewBox).attr('preserveAspectRatio', null);
  } else {
    const viewBox = [(0 - x) / zoom, (0 - y) / zoom, viewBoxWidth / zoom, viewBoxHeight / zoom];
    svgSub.attr('viewBox', viewBox).attr('preserveAspectRatio', 'xMinYMin meet');
  }
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
