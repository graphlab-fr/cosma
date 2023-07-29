import GraphEngine from 'graphology';
import { bfsFromNode as neighborsExtend } from 'graphology-traversal/bfs';
import hotkeys from 'hotkeys-js';
import { displayNodesAll, setNodesDisplaying } from './graph';
import View from './view';
import filterPriority from './filterPriority';

let graph = getGraphEngine();

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLInputElement} */
  const checkbox = document.getElementById('focus-check');
  /** @type {HTMLSelectElement} */
  const modeSelect = document.getElementById('focus-mode-select');
  /** @type {HTMLInputElement} */
  const input = document.getElementById('focus-input');

  if (focusIsActive === false) {
    return;
  }

  checkbox.checked = false;

  let focusMode;

  const { searchParams } = new URL(window.location);
  const focusFromSearch = Number(searchParams.get('focus'));
  if (isNaN(focusFromSearch) === false && focusFromSearch > 0) {
    input.value = focusFromSearch;
    active();
  }

  hotkeys('f', (e) => {
    e.preventDefault();
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  });

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
  });

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      active();
    } else {
      input.classList.remove('active');
      input.removeEventListener('input', display);
      modeSelect.removeEventListener('change', changeMode);
      displayNodesAll(filterPriority.filteredByFocus);
    }
  });

  function active() {
    if (View.openedRecordId === undefined) {
      checkbox.checked = false;
      return;
    }

    changeMode();
    modeSelect.addEventListener('change', changeMode);

    display();
    input.classList.add('active');
    input.addEventListener('input', display);
    input.focus();
  }

  function display() {
    const nodeIdOrigin = View.openedRecordId;
    const neighborsNodeIds = [];

    neighborsExtend(
      graph,
      nodeIdOrigin,
      (nodeId, attr, depth) => {
        neighborsNodeIds.push(nodeId);
        return depth >= input.valueAsNumber;
      },
      { mode: focusMode },
    );

    setNodesDisplaying(neighborsNodeIds, filterPriority.filteredByFocus);
  }

  function changeMode() {
    focusMode = modeSelect.value;
    display();
  }
});

/**
 * @returns {GraphEngine}
 */

function getGraphEngine() {
  const graph = new GraphEngine();

  for (const { id, label } of data.nodes) {
    if (graph.hasNode(id)) {
      continue;
    }

    graph.addNode(id, {
      label,
    });
  }
  for (const { source, target } of data.links) {
    if (graph.hasEdge(source.id, target.id)) {
      continue;
    }

    graph.addEdge(source.id, target.id);
  }

  return graph;
}
