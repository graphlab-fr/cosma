import { graph, highlightNodes, unlightNodes } from './graph.js';
import { zoomToNode } from './zoom.js';
import hotkeys from 'hotkeys-js';

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

graph.on('nodeAttributesUpdated', function ({ key, attributes }) {
  const elt = indexContainer.querySelector(`[data-index="${key}"]`);
  elt.style.display = attributes.hidden ? 'none' : null;
});

export { getRecordIdFromHash };
