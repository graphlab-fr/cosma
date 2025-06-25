/**
 * @typedef NodeNetwork
 * @type {object}
 * @property {d3.Selection<SVGGElement, Node, SVGElement>} nodes
 * @property {d3.Selection<SVGLineElement, Link, SVGElement>} links
 */

import * as d3 from 'd3';
import GraphEngine from 'graphology';

import View from './view.js';
import { getRecordIdFromHash } from './records.js';
import { setCounters } from './counter.js';
import hotkeys from 'hotkeys-js';

/** Data serialization
------------------------------------------------------------*/

const graph = new GraphEngine({ multi: true });
graph.import(data);

graph.updateEachNodeAttributes((node, attr) => {
  return {
    ...attr,
    hidden: false,
  };
});

const allNodeIds = graph.nodes();

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
    d3.forceLink(data.edges).id((d) => d.key),
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
  
  elts.linkLabels
    .attr("x", (d) => (d.source.x + d.target.x) / 2)
    .attr("y", (d) => (d.source.y + d.target.y) / 2)
    .attr("text-anchor", "middle")
    .attr("transform", d => {
      var angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI;

      // Adjust angle to avoid upside-down text
      if (angle > 90 || angle < -90) {
        angle = (angle + 180) % 360;
      }
      
      var x = (d.source.x + d.target.x) / 2;
      var y = (d.source.y + d.target.y) / 2;
      return `rotate(${angle},${x},${y})`;
    });

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
  .attr('class', 'links-group')
  .selectAll('line')
  .data(data.edges)
  .enter()
  .append('line')
  .attr('stroke', (d) => `var(--l_${d.attributes.type})`)
  .attr('title', (d) => d.attributes.title)
  .attr('data-link', (d) => d.key)
  .attr('data-source', (d) => d.source.key)
  .attr('data-target', (d) => d.target.key)
  .attr('stroke-dasharray', function (d) {
    if (d.attributes.shape.stroke === 'dash' || d.attributes.shape.stroke === 'dotted') {
      return d.attributes.shape.dashInterval;
    }
    return false;
  })
  .attr('filter', function (d) {
    if (d.attributes.shape.stroke === 'double') {
      return 'url(#double)';
    }
    return false;
  });

if (graphProperties.graph_arrows === true) {
  elts.links.attr('marker-end', 'url(#arrow)');
}

elts.linkLabels = svgSub
  .append('g')
  .selectAll("text")
  .data(data.edges)
  .enter()
  .append("text")
  .attr('font-size', graphProperties.graph_text_size)
  .text(d => d.attributes.type); // Assuming each link has a label

const strokeWidth = 2;

/** @type {d3.Selection<SVGGElement, Node, SVGElement, any>} */
elts.nodes = svgSub
  .append('g')
  .selectAll('g')
  .data(data.nodes)
  .enter()
  .append('g')
  .attr('data-node', (d) => d.key)
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
  .on('mouseover', (e, { key: nodeId }) => {
    if (!graphProperties.graph_highlight_on_hover) {
      return;
    }

    const links = graph.edges(nodeId);
    const nodes = graph.neighbors(nodeId);
    nodes.push(nodeId);

    const linksTransparent = elts.links.filter(({ key }) => !links.includes(key));
    const nodesTransparent = elts.nodes.filter(({ key }) => !nodes.includes(key));
    const linksHovered = elts.links.filter(({ key }) => links.includes(key));
    const nodesHovered = elts.nodes.filter(({ key }) => nodes.includes(key));

    nodesHovered.nodes().forEach((elt) => elt.classList.add('highlight'));
    linksHovered.nodes().forEach((elt) => elt.classList.add('highlight'));
    nodesTransparent.nodes().forEach((elt) => elt.classList.add('translucent'));
    linksTransparent.nodes().forEach((elt) => elt.classList.add('translucent'));
  })
  .on('mouseout', (e, { key: nodeId }) => {
    if (!graphProperties.graph_highlight_on_hover) {
      return;
    }

    const selectedNodeId = getRecordIdFromHash();

    elts.nodes
      .filter(({ key }) => {
        if (selectedNodeId) {
          return key !== selectedNodeId;
        }
        return true;
      })
      .nodes()
      .forEach((elt) => elt.classList.remove('highlight'));
    elts.links
      .filter((link) => {
        if (selectedNodeId) {
          return link.source.key !== selectedNodeId && link.target.key !== selectedNodeId;
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
  const link = node.append('a').attr('href', (d) => '#' + d.key);

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
    link
      .append('circle')
      .attr('class', 'border')
      .attr('r', d.attributes.size + 2)
      .attr('fill', stroke);
    /** Foreground: circle contains color or image */
    link.append('circle').attr('r', d.attributes.size).attr('fill', fill);
  };

  if (d.attributes.thumbnail) {
    if (d.attributes.types.length === 1) {
      const type = graphProperties['record_types'][d.attributes.types[0]];
      drawSimpleCircle(type.stroke, `url(#${d.attributes.thumbnail})`);
    } else {
      generatePathCoordinatesWithBorder(
        d.attributes.types.length,
        d.attributes.size,
        strokeWidth,
      ).forEach(({ border }, i) => {
        const type = graphProperties['record_types'][d.attributes.types[i]];
        /** Background: borders with one color per type */
        link.append('path').attr('d', border).attr('fill', type.stroke).attr('class', 'border');
      });
      /** Background: neutral white color */
      link.append('circle').attr('r', d.attributes.size).attr('fill', `var(--background-gray)`);
      /** Foreground: circle contains thumbnail */
      link
        .append('circle')
        .attr('r', d.attributes.size)
        .attr('fill', `url(#${d.attributes.thumbnail})`);
    }
    return;
  }

  if (d.attributes.types.length === 1) {
    const type = graphProperties['record_types'][d.attributes.types[0]];
    drawSimpleCircle(type.stroke, getFill(type.fill));
  } else {
    generatePathCoordinatesWithBorder(
      d.attributes.types.length,
      d.attributes.size,
      strokeWidth,
    ).forEach(({ segment, border }, i) => {
      const type = graphProperties['record_types'][d.attributes.types[i]];
      /** Background: borders with one color per type */
      link.append('path').attr('d', border).attr('fill', type.stroke).attr('class', 'border');
      /** Background: neutral white color */
      link.append('path').attr('d', segment).attr('fill', 'var(--background-gray)');
      /** Foreground: circle fragment per type with color or image */
      link.append('path').attr('d', segment).attr('fill', getFill(type.fill));
    });
  }
});

/** @type {d3.Selection<SVGTextElement, Node, SVGGElement, any>} */
elts.labels = elts.nodes
  .select('a')
  .append('text')
  .attr('class', 'label')
  .each(function (d) {
    const words = d.attributes.label.split(' '),
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
  .attr('y', (d) => d.attributes.size)
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
 * @param {string} nodeIds - List of nodes ids
 */

function getNodeNetwork(nodeId) {
  const node = elts.nodes.filter(({ key }) => key === nodeId);
  // Links related to this node will be handled by highlight/unlight functions
  return { node };
}

function setNodesDisplaying(nodeIdsToShow) {
  const nodesToShowSet = new Set(nodeIdsToShow);
  allNodeIds.forEach(nodeId => {
    const shouldShow = nodesToShowSet.has(nodeId);
    // Use Graphology attribute for node state
    graph.setNodeAttribute(nodeId, 'hidden', !shouldShow);
  });

  // Update the D3 node elements based on the Graphology attribute
  elts.nodes.style('display', d => graph.getNodeAttribute(d.key, 'hidden') ? 'none' : null);
  elts.labels.style('display', d => graph.getNodeAttribute(d.key, 'hidden') ? 'none' : null); // Also hide/show labels

  updateLinkVisibilityBasedOnFiltersAndNodes();
  setCounters(); // Update counters after nodes change
}

graph.on('nodeAttributesUpdated', function ({ key, attributes }) {
  const { links, node } = getNodeNetwork(key);

  if (attributes.hidden) {
    node.node().classList.add('hide');
  } else {
    node.node().classList.remove('hide');
  }
});

/**
 * Hide some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function hideNodes(nodeIds) {
  nodeIds.forEach((nodeId) => graph.setNodeAttribute(nodeId, 'hidden', true));
}

/**
 * Display some nodes & their links, by their id
 * @param {array} nodeIds - List of nodes ids
 */

function displayNodes(nodeIds) {
  nodeIds.forEach((nodeId) => graph.setNodeAttribute(nodeId, 'hidden', false));
}

function displayNodesAll() {
  allNodeIds.forEach(nodeId => {
    graph.setNodeAttribute(nodeId, 'hidden', false);
  });
  elts.nodes.style('display', null);
  elts.labels.style('display', null); // Also show labels

  // Update link visibility after showing all nodes
  updateLinkVisibilityBasedOnFiltersAndNodes();
  setCounters();
}

// --- Manage Link Visibility ---

// Keep track of which link types are currently active based on checkboxes
let activeLinkTypes = new Set(Object.keys(linkTypeList)); // Initially all active

// Function called by filter.js when link checkboxes change
function updateLinkVisibility(newActiveLinkTypes) {
    activeLinkTypes = newActiveLinkTypes;
    updateLinkVisibilityBasedOnFiltersAndNodes();
}

// Central function to update link visibility based on *both* filters and node visibility
function updateLinkVisibilityBasedOnFiltersAndNodes() {
  console.log("updating link visibility")
  if (!linksDisplayToggle) { // Skip if links are globally toggled off
    console.log("early return because links toggled off")
    elts.links.style('display', 'none');
    elts.linkLabels.style('display', 'none');
    return;
  }

  elts.links.style('display', d => {
    const typeIsActive = activeLinkTypes.has(d.attributes.type || 'undefined');
    const sourceIsVisible = !graph.getNodeAttribute(d.source.key, 'hidden');
    const targetIsVisible = !graph.getNodeAttribute(d.target.key, 'hidden');
    return typeIsActive && sourceIsVisible && targetIsVisible ? null : 'none';
  });

  if (!linkLabelsDisplayToggle) { // Skip if labels are globally toggled off
    elts.linkLabels.style('display', 'none');
  } else {
    elts.linkLabels.style('display', d => {
      const typeIsActive = activeLinkTypes.has(d.attributes.type || 'undefined');
      const sourceIsVisible = !graph.getNodeAttribute(d.source.key, 'hidden');
      const targetIsVisible = !graph.getNodeAttribute(d.target.key, 'hidden');
      return typeIsActive && sourceIsVisible && targetIsVisible ? null : 'none';
    });
  }
    // Note: No need to update counters for links usually, unless you add a link counter UI element.
}

let highlightedNodes = [];

/**
 * Apply highlightColor (from config) to somes nodes and their links
 * @param {string[]|number[]} nodeIds - List of nodes ids
 */

function highlightNodes(nodeIds) {
  nodeIds
    .filter((nodeId) => graph.hasNode(nodeId))
    .forEach((nodeId) => {
      const { links, node } = getNodeNetwork(nodeId);
      node.node().classList.add('highlight');
      elts.links.nodes().forEach((elt) => elt.classList.add('highlight'));
    });

  highlightedNodes = highlightedNodes.concat(nodeIds);
}

/**
 * remove highlightColor from all highlighted nodes and their links
 */

function unlightNodes() {
  if (highlightedNodes.length === 0) {
    return;
  }

  highlightedNodes
    .filter((nodeId) => graph.hasNode(nodeId))
    .forEach((nodeId) => {
      const { links, node } = getNodeNetwork(nodeId);
      node.node().classList.remove('highlight');
      elts.links.nodes().forEach((elt) => elt.classList.remove('highlight'));
    });

  highlightedNodes = [];
}

/**
 * Toggle display/hide nodes links
 * @param {boolean} isChecked - 'checked' value send by a checkbox input
 */

let linksDisplayToggle = true; // Keep track of global link toggle state
window.linksDisplayToggle = function (isChecked) {
  linksDisplayToggle = isChecked;
  updateLinkVisibilityBasedOnFiltersAndNodes(); // Update visibility when toggled
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

let linkLabelsDisplayToggle = true; // Keep track of global label toggle state
window.linkLabelDisplayToggle = function (isChecked) {
  linkLabelsDisplayToggle = isChecked;
  updateLinkVisibilityBasedOnFiltersAndNodes(); // Update visibility when toggled
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

  const { x, y, zoom } = position;

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

const zoomMax = 10,
  zoomMin = 1;

let zoomInterval = 0.2;

/**
 * Sum of nodes size
 * @type {number}
 */
const nodeFactor = graph.reduceNodes((acc, node, { size }) => acc + size, 0);

window.addEventListener('resize', () => {
  let density = nodeFactor / (window.innerWidth * window.innerHeight);
  density *= 1000;

  zoomInterval = Math.log2(density);
});

const position = { x: 0, y: 0, zoom: 1 };

const zoom = d3
  .zoom()
  .scaleExtent([zoomMin, zoomMax])
  .on('zoom', (e) => {
    const { x, y, k } = e.transform;
    position.x = x || 0;
    position.y = y || 0;
    position.zoom = k || 1;
    translate();
  });

svg.call(zoom);

function zoomMore() {
  zoom.scaleTo(svg, position.zoom + zoomInterval);
}

function zoomLess() {
  zoom.scaleTo(svg, position.zoom - zoomInterval);
}

function zoomReset() {
  position.zoom = 1;
  position.x = 0;
  position.y = 0;
  svg.call(zoom.transform, d3.zoomIdentity.translate(position.y, position.x).scale(position.zoom));
  translate();
}

window.zoomMore = zoomMore;
window.zoomLess = zoomLess;
window.zoomReset = zoomReset;

hotkeys('e,alt+r', (e) => {
  e.preventDefault();
  zoomReset();
});

/**
 * Zoom to a node from its coordinates
 * @param {string} nodeId
 */

function zoomToNode(nodeId) {
  const nodes = elts.nodes.data();

  const node = nodes.find(({ key }) => key === nodeId);

  if (!node) return;
  const { x, y } = node;

  const meanX = d3.mean(nodes, (d) => d.x);
  const meanY = d3.mean(nodes, (d) => d.y);

  const zoomScale = position.zoom === 1 ? position.zoom + zoomInterval * 2 : position.zoom;

  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(-(x * zoomScale - meanX), -(y * zoomScale - meanY)).scale(zoomScale),
  );
  translate();
}

hotkeys('c', (e) => {
  e.preventDefault();
  const recordId = getRecordIdFromHash();

  zoomToNode(recordId);
});

export {
  svg,
  svgSub,
  displayNodesAll,
  setNodesDisplaying,
  updateLinkVisibility,
  highlightNodes,
  unlightNodes,
  translate,
  graph,
  zoomToNode,
};
