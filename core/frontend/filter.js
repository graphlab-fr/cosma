/**
 * @file Select filters elts and activate them by the ids them contain.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import { setNodesDisplaying, setLinksDisplaying, graph } from './graph.js';
import hotkeys from 'hotkeys-js';

/**
 * Display all hidden elements by checking all unchecked inputs
 * @param {HTMLFormElement} form - The form containing the filters
 */
function displayAllHidden(form) {
  form.querySelectorAll('input:not(:checked)').forEach((input) => (input.checked = true));
  form.dispatchEvent(new Event('change'));
}

/**
 * Hide all elements except the specified one
 * @param {HTMLFormElement} form - The form containing the filters
 * @param {HTMLInputElement[]} inputs - List of form inputs
 * @param {string} filterName - Name of the filter to keep visible
 */
function hideAllExceptOne(form, inputs, filterName) {
  inputs.forEach((input) => (input.checked = filterName === input.name));
  form.dispatchEvent(new Event('change'));
}

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('types-form');
  /** @type {HTMLInputElement[]} */
  const inputs = form.querySelectorAll('input');

  /** @type {[string, string[]][]} */
  const types = Object.entries(typeList);

  /**
   * Default state
   */

  for (const [name] of types) {
    form.querySelector(`[name="${name}"]`).checked = true;
  }
  changeTypesState();

  /**
   * Search params state
   */

  const { searchParams } = new URL(window.location);
  const filtersFromSearch = searchParams.get('filters')?.split('-');

  if (filtersFromSearch?.length) {
    for (const [name] of types) {
      form.querySelector(`[name="${name}"]`).checked = filtersFromSearch.includes(name);
    }
    changeTypesState();
  }

  /**
   * User actions state
   */

  form.addEventListener('change', changeTypesState);

  function changeTypesState() {
    let formState = new FormData(form);
    formState = Object.fromEntries(formState);

    const nodeIdsToDisplay = new Set();

    types
      .filter(([name]) => Boolean(formState[name]))
      .forEach(([, nodes]) => {
        nodes.forEach((id) => nodeIdsToDisplay.add(id));
      });

    setNodesDisplaying(Array.from(nodeIdsToDisplay));
  }

  let filterNameAltMode;
  for (const input of inputs) {
    const { name: filterName } = input;

    input.parentElement.addEventListener('click', (e) => {
      const altMode = e.altKey;
      if (altMode) {
        e.stopPropagation();
        e.preventDefault();

        if (filterNameAltMode === filterName) {
          displayAllHidden(form);
          filterNameAltMode = undefined;
        } else {
          hideAllExceptOne(form, inputs, filterName);
          filterNameAltMode = filterName;
        }
      }
    });
  }

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    displayAllHidden(form);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('link-types-form');
  /** @type {HTMLInputElement[]} */
  const inputs = form.querySelectorAll('input');

  form.reset();

  changeTypesState();

  form.addEventListener('change', changeTypesState);

  function changeTypesState() {
    let formState = new FormData(form);
    formState = Object.fromEntries(formState);

    const selectedTypes = Object.keys(formState);

    const selectedLinks = graph.filterEdges((key, attrs) => selectedTypes.includes(attrs.type));

    setLinksDisplaying(selectedLinks);
  }

  let filterNameAltMode;

  for (const input of inputs) {
    const { name: filterName } = input;

    input.parentElement.addEventListener('click', (e) => {
      const altMode = e.altKey;
      if (altMode) {
        e.stopPropagation();
        e.preventDefault();

        if (filterNameAltMode === filterName) {
          displayAllHidden(form);
          filterNameAltMode = undefined;
        } else {
          hideAllExceptOne(form, inputs, filterName);
          filterNameAltMode = filterName;
        }
      }
    });
  }

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    displayAllHidden(form);
  });
});
