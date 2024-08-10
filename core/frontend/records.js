import { nodes, highlightNodes, unlightNodes } from './graph.js';
import { zoomToNode } from './zoom.js';
import hotkeys from 'hotkeys-js';
import filterPriority from './filterPriority.js';

window.addEventListener('DOMContentLoaded', () => {
  const recordContainer = document.getElementById('record-container');
  const closeRightSideButton = document.getElementById('close-right-side');

  const recordId = getRecordIdFromHash();
  if (recordId) openRecord(recordId);

  let hasRightSideClosedByClick = false;
  closeRightSideButton.addEventListener('click', () => {
    closeRightSideButton.classList.toggle('active');
    recordContainer.classList.toggle('active');

    hasRightSideClosedByClick = !hasRightSideClosedByClick;
  });

  hotkeys('escape', () => {
    closeRightSideButton.classList.remove('active');
    recordContainer.classList.remove('active');

    // remove hash from URL
    history.pushState('', document.title, window.location.pathname);

    unlightNodes();
  });

  window.addEventListener('hashchange', () => {
    const recordId = getRecordIdFromHash();
    if (recordId) {
      openRecord(recordId);
      zoomToNode(recordId);
    } else {
      recordContainer.classList.remove('active');
      unlightNodes();
    }
  });

  function openRecord(id) {
    const recordContent = document.getElementById(id);

    if (!recordContent) {
      return;
    }

    closeLastOpenedRecord();

    // open records container
    if (!hasRightSideClosedByClick) {
      closeRightSideButton.classList.add('active');
      recordContainer.classList.add('active');
    }
    // adjust record view
    recordContainer.scrollTo({ top: 0 });

    closeLastOpenedRecord();

    // show record
    recordContent.classList.add('active');

    // reset nodes highlighting
    unlightNodes();
    highlightNodes([id]);

    const recordTitle = recordContent.querySelector('h1').textContent;
    document.title = recordTitle;
  }
});

function closeLastOpenedRecord() {
  const lastOpenedRecord = document.querySelector('.record.active');
  lastOpenedRecord && lastOpenedRecord.classList.remove('active');
}

function getRecordIdFromHash() {
  const { hash } = new URL(window.location);
  if (hash) {
    const recordId = decodeURI(hash.substring(1));
    return recordId;
  }
  return undefined;
}

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
  // nodesIds = nodesIds.filter(function (nodeId) {
  //   // hidden nodes can not be displayed
  //   const nodeIsHidden = nodes.find((i) => i.id === nodeId).hidden;
  //   if (nodeIsHidden === filterPriority.notFiltered) {
  //     return true;
  //   }
  // });
  // for (const indexItem of nodesIds) {
  //   const indexItems = indexContainer.querySelectorAll('[data-index="' + indexItem + '"]');
  //   indexItems.forEach((elt) => {
  //     elt.style.display = null;
  //   });
  // }
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

export {
  getRecordIdFromHash,
  hideFromIndex,
  hideAllFromIndex,
  displayFromIndex,
  displayAllFromIndex,
};
