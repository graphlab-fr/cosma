import { setCounters } from './counter';
import { setNodesDisplaying, displayNodesAll } from './graph';
import filterPriority from './filterPriority';

const { begin, end } = timeline;

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLInputElement} */
  const checkbox = document.getElementById('timeline-checkbox');
  /** @type {HTMLFormElement} */
  const form = document.getElementById('timeline-form');
  /** @type {HTMLDataListElement} */
  const ticks = document.getElementById('timeline-ticks');
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

    if (begin === undefined || end === undefined) {
      return;
    }

    const toDisplay = [];

    for (let { begin: nodeBegin, end: nodeEnd, id } of data.nodes) {
      if (nodeEnd === undefined) {
        nodeEnd = end;
      }
      if (nodeBegin === undefined) {
        nodeBegin = begin;
      }

      if (timestamp >= nodeBegin && timestamp <= nodeEnd) {
        toDisplay.push(id);
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
    ticks.insertAdjacentHTML(
      'beforeend',
      `<option value="${begin}">${getDateFromTimesetamp(begin)}</option>`
    );
    for (let i = 1; i <= tickNb; i++) {
      if (i === tickNb) {
        ticks.insertAdjacentHTML(
          'beforeend',
          `<option value="${end}">${getDateFromTimesetamp(end)}</option>`
        );
        continue;
      }

      ticks.insertAdjacentHTML(
        'beforeend',
        `<option value="${begin + step * i}">${getDateFromTimesetamp(begin + step * i)}</option>`
      );
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
