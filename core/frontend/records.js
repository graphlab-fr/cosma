import View from './view';
import historique from './history';
import { nodes, highlightNodes, unlightNodes } from './graph';
import hotkeys from 'hotkeys-js';
import filterPriority from './filterPriority';

const recordContainer = document.getElementById('record-container');

window.openRecord = function (id, history = true) {
  const recordContent = document.getElementById(id);

  if (!recordContent) {
    return;
  }

  if (View.openedRecordId !== undefined) {
    // hide last record
    document.getElementById(View.openedRecordId).classList.remove('active');
  }

  // open records container
  recordContainer.classList.add('active');
  // adjust record view
  recordContainer.scrollTo({ top: 0 });

  // show record
  recordContent.classList.add('active');

  View.openedRecordId = id;

  // reset nodes highlighting
  unlightNodes();
  highlightNodes([id]);

  if (history) {
    // page's <title> become record's name
    const recordTitle = recordContent.querySelector('h1').textContent;
    historique.actualiser(id, recordTitle);
  }
};

/**
 * Close the record reading panel & the opended one
 */

window.closeRecord = function () {
  recordContainer.classList.remove('active');
  document.getElementById(View.openedRecordId).classList.remove('active');
  View.openedRecordId = undefined;
  unlightNodes();
};

hotkeys('escape', (e) => {
  e.preventDefault();
  closeRecord();
});

window.addEventListener('DOMContentLoaded', () => {
  const { hash } = new URL(window.location);
  if (hash) {
    const recordId = hash.substring(1);
    openRecord(recordId);
  }
});

// At navigation travel, with forward/backward webbrowser's buttons
window.onpopstate = function (e) {
  if (e.state === null) {
    return;
  }
  // open record from a history entry
  const timeline = e.state.hist,
    recordId = timeline[timeline.length - 1];

  openRecord(recordId, false);
};

const indexContainer = document.getElementById('index');

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLSelectElement} */
  const sortSelect = indexContainer.querySelector('.sorting-select');
  const recordsSorting = sorting.records;

  queryAndSortIndexElements();
  sortSelect.addEventListener('change', queryAndSortIndexElements);

  function queryAndSortIndexElements() {
    /** @type {HTMLLIElement[]} */
    const indexElements = indexContainer.querySelectorAll('li');
    const [sortingKey, direction] = sortSelect.value.split(':');

    for (let i = 0; i < indexElements.length; i++) {
      let order = recordsSorting[i][sortingKey];
      const elt = indexElements[i];

      if (direction === 'reverse') {
        order = indexElements.length - 1 - order;
      }

      elt.style.order = order;
    }
  }
});

/**
 * Hide items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function hideFromIndex(nodesIds) {
  for (const indexItem of nodesIds) {
    const indexItems = indexContainer.querySelectorAll('[data-index="' + indexItem + '"]');
    indexItems.forEach((elt) => {
      elt.style.display = 'none';
    });
  }
}

/**
 * Hide all items from the index list
 */

function hideAllFromIndex() {
  indexContainer.querySelectorAll('[data-index]').forEach((elt) => {
    elt.style.display = 'none';
  });
}

/**
 * Display items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function displayFromIndex(nodesIds) {
  nodesIds = nodesIds.filter(function (nodeId) {
    // hidden nodes can not be displayed
    const nodeIsHidden = nodes.find((i) => i.id === nodeId).hidden;
    if (nodeIsHidden === filterPriority.notFiltered) {
      return true;
    }
  });

  for (const indexItem of nodesIds) {
    const indexItems = indexContainer.querySelectorAll('[data-index="' + indexItem + '"]');
    indexItems.forEach((elt) => {
      elt.style.display = null;
    });
  }
}

/**
 * Display all items from the index list
 */

function displayAllFromIndex() {
  const indexItems = indexContainer.querySelectorAll('[data-index]');
  indexItems.forEach((elt) => {
    elt.style.display = null;
  });
}

export { hideFromIndex, hideAllFromIndex, displayFromIndex, displayAllFromIndex };
