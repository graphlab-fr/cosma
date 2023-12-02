import * as d3 from 'd3';

import View from './view';
import { svg, translate, nodes } from './graph';
import hotkeys from 'hotkeys-js';
import { getRecordIdFromHash } from './records';

const zoomMax = 10,
  zoomMin = 1,
  zoomInterval = 0.2;

const zoom = d3
  .zoom()
  .scaleExtent([zoomMin, zoomMax])
  .on('zoom', () => {
    const { x, y, k } = d3.event.transform;
    console.log(k);
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

/**
 * Zoom to a node from its coordinates
 * @param {string} nodeId
 */

function zoomToNode(nodeId) {
  const { x, y } = nodes.find(({ id }) => id === nodeId);

  const meanX = d3.mean(nodes, (d) => d.x);
  const meanY = d3.mean(nodes, (d) => d.y);

  const zoomScale = 2;

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

hotkeys('e,alt+r', (e) => {
  e.preventDefault();
  zoomReset();
});

window.zoomMore = zoomMore;
window.zoomLess = zoomLess;
window.zoomReset = zoomReset;
