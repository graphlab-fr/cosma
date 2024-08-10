import { setCounters } from './counter.js';
import { setNodesDisplaying, displayNodesAll } from './graph.js';
import filterPriority from './filterPriority.js';

const { begin, end } = timeline;

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLInputElement} */
  const checkbox = document.getElementById('timeline-checkbox');
  /** @type {HTMLFormElement} */
  const form = document.getElementById('timeline-form');
  /** @type {HTMLDataListElement} */
  const ticks = document.getElementById('timeline-ticks');

  if (!form) return;

  /** @type {HTMLOutputElement} */
  const output = form.querySelector('output');
  /** @type {HTMLInputElement} */
  const range = form.querySelector('input[type="range"]');

  checkbox.checked = false;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      form.classList.add('active');
      setChronosTicks();
      action();
      window.addEventListener('resize', setChronosTicks);
      range.addEventListener('input', action);
    } else {
      form.classList.remove('active');
      window.removeEventListener('resize', setChronosTicks);
      range.removeEventListener('input', action);

      displayNodesAll(filterPriority.filteredByTimeline);
      setCounters();
    }
  });

  function action() {
    const timestamp = range.value;
    output.value = getDateFromTimesetamp(timestamp);

    const toDisplay = [];

    for (let {
      attributes: { begin: nodeBegin, end: nodeEnd },
      key,
    } of data.nodes) {
      if (nodeEnd === undefined) {
        nodeEnd = end;
      }
      if (nodeBegin === undefined) {
        nodeBegin = begin;
      }

      if (timestamp >= nodeBegin && timestamp <= nodeEnd) {
        toDisplay.push(key);
      }
    }

    setNodesDisplaying(toDisplay, filterPriority.filteredByTimeline);
    setCounters();
  }

  function setChronosTicks() {
    const tickNb = Math.round(form.offsetWidth / 100);
    const step = Math.round((end - begin) / tickNb);

    ticks.setAttribute('style', `--list-length: ${tickNb + 1};`);
    ticks.innerHTML = '';

    const addTick = (timestamp) => {
      const optionElt = document.createElement('option');
      optionElt.value = timestamp;
      optionElt.textContent = getDateFromTimesetamp(timestamp);
      optionElt.addEventListener('click', () => {
        range.value = timestamp;
        action();
      });
      ticks.appendChild(optionElt);
    };

    addTick(begin);

    for (let i = 1; i <= tickNb; i++) {
      if (i === tickNb) {
        addTick(end);
        continue;
      }

      addTick(begin + step * i);
    }
  }
});

/**
 * @param {number} timestamp
 * @returns {string}
 */

function getDateFromTimesetamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(graphProperties.lang);
}
