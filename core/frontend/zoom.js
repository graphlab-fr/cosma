import * as d3 from 'd3';

import View from './view.js';
import { svg, translate, graph } from './graph.js';
import hotkeys from 'hotkeys-js';
import { getRecordIdFromHash } from './records.js';

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

const zoom = d3
  .zoom()
  .scaleExtent([zoomMin, zoomMax])
  .on('zoom', (e) => {
    const { x, y, k } = e.transform;
    View.position.x = x || 0;
    View.position.y = y || 0;
    View.position.zoom = k || 1;
    translate();
  });

svg.call(zoom);

function zoomMore() {
  zoom.scaleTo(svg, View.position.zoom + zoomInterval);
}

function zoomLess() {
  zoom.scaleTo(svg, View.position.zoom - zoomInterval);
}

function zoomReset() {
  View.position.zoom = 1;
  View.position.x = 0;
  View.position.y = 0;
  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(View.position.y, View.position.x).scale(View.position.zoom),
  );
  translate();
}

hotkeys('e,alt+r', (e) => {
  e.preventDefault();
  zoomReset();
});

/**
 * Zoom to a node from its coordinates
 * @param {string} nodeId
 */

function zoomToNode(nodeId) {
  const node = nodes.find(({ id }) => id === nodeId);
  if (!node) return;
  const { x, y } = node;

  const meanX = d3.mean(nodes, (d) => d.x);
  const meanY = d3.mean(nodes, (d) => d.y);

  const zoomScale =
    View.position.zoom === 1 ? View.position.zoom + zoomInterval * 2 : View.position.zoom;

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

window.zoomMore = zoomMore;
window.zoomLess = zoomLess;
window.zoomReset = zoomReset;

export { zoomToNode };
