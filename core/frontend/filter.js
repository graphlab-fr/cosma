/**
 * @file Select filters elts and activate them by the ids them contain.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

import { setNodesDisplaying } from './graph';
import filterPriority from './filterPriority';

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('types-form');
  /** @type {HTMLInputElement[]} */
  const inputs = form.querySelectorAll('input');

  /**
   * Default state
   */

  for (const [name, { active }] of Object.entries(typeList)) {
    form.querySelector(`[name="${name}"]`).checked = active;
  }
  changeTypesState();

  /**
   * Search params state
   */

  const { searchParams } = new URL(window.location);
  const filtersFromSearch = searchParams.get('filters')?.split('-');

  if (filtersFromSearch?.length) {
    for (const [name] of Object.entries(typeList)) {
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

    formState = Object.entries(typeList)
      .filter(([name]) => !!formState[name])
      .forEach(([, { nodes }]) => {
        nodes.forEach((id) => nodeIdsToDisplay.add(id));
      });

    setNodesDisplaying(Array.from(nodeIdsToDisplay), filterPriority.filteredByType);
  }

  let filterNameAltMode;
  for (const input of inputs) {
    const { name: filterName, checked: active } = input;

    input.parentElement.addEventListener('click', (e) => {
      const altMode = e.altKey;
      if (altMode) {
        e.stopPropagation();
        e.preventDefault();

        if (filterNameAltMode === filterName) {
          displayHidden();
          filterNameAltMode = undefined;
        } else {
          hideAllButOne(filterName);
          filterNameAltMode = filterName;
        }
      }
    });
  }

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    displayHidden();
  });

  function displayHidden() {
    form
      .querySelectorAll(`input:not(:checked)`)
      .forEach((checkedInput) => (checkedInput.checked = true));
    form.dispatchEvent(new Event('change'));
  }

  function hideAllButOne(filterName) {
    inputs.forEach((input) => (input.checked = filterName === input.name));
    form.dispatchEvent(new Event('change'));
  }
});
