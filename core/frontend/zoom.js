import * as d3 from 'd3';

import View from './view';
import { svg, translate } from './graph';
import hotkeys from 'hotkeys-js';

const zoomMax = 10,
  zoomMin = 1,
  zoomInterval = 1;

const zoom = d3
  .zoom()
  .scaleExtent([zoomMin, zoomMax])
  .on('zoom', () => {
    const { x, y, k } = d3.event.transform;
    View.position.x = x / k || 0;
    View.position.y = y / k || 0;
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

window.zoomMore = zoomMore;
window.zoomLess = zoomLess;
window.zoomReset = zoomReset;
