/**
 * @file Select filters elts and activate them by the ids them contain.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

import { setNodesDisplaying, setLinksDisplaying } from './graph';
import filterPriority from './filterPriority';

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('types-form');
  /** @type {HTMLFormElement} */
  const linkForm = document.getElementById('link-types-form');
  /** @type {HTMLInputElement[]} */
  const inputs = form.querySelectorAll('input');
  /** @type {HTMLInputElement[]} */
  const linkInputs = linkForm.querySelectorAll('input');

  /**
   * Default state
   */

  for (const [name, { active }] of Object.entries(typeList)) {
    form.querySelector(`[name="${name}"]`).checked = active;
  }
  changeTypesState();

  for (const [name, { active }] of Object.entries(linkTypeList)) {
    linkForm.querySelector(`[name="${name}"]`).checked = active;
  }
  changeLinkTypesState();

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

  const linkFiltersFromSearch = searchParams.get('filters')?.split('-');

  if (linkFiltersFromSearch?.length) {
    for (const [name] of Object.entries(linkTypeList)) {
      form.querySelector(`[name="${name}"]`).checked = linkFiltersFromSearch.includes(name);
    }
    changeLinkTypesState();
  }

  /**
   * User actions state
   */

  form.addEventListener('change', changeTypesState);
  linkForm.addEventListener('change', changeLinkTypesState);

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

  function changeLinkTypesState() {
    let formState = new FormData(linkForm);
    formState = Object.fromEntries(formState);

    const linkIdsToDisplay = new Set();

    formState = Object.entries(linkTypeList)
      .filter(([name]) => !!formState[name])
      .forEach(([, { links }]) => {
        links.forEach((id) => linkIdsToDisplay.add(id));
      });

    setLinksDisplaying(Array.from(linkIdsToDisplay), filterPriority.filteredByType);
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
          displayHidden(form);
          filterNameAltMode = undefined;
        } else {
          hideAllButOne(form, inputs, filterName);
          filterNameAltMode = filterName;
        }
      }
    });
  }

  let linkFilterNameAltMode;
  for (const input of linkInputs) {
    const { name: filterName, checked: active } = input;

    input.parentElement.addEventListener('click', (e) => {
      const altMode = e.altKey;
      if (altMode) {
        e.stopPropagation();
        e.preventDefault();

        if (linkFilterNameAltMode === filterName) {
          displayHidden(linkForm);
          linkFilterNameAltMode = undefined;
        } else {
          hideAllButOne(linkForm, linkInputs, filterName);
          linkFilterNameAltMode = filterName;
        }
      }
    });
  }

  // reset all displays
  hotkeys('alt+r', (e) => {
    e.preventDefault();
    displayHidden(form);
    displayHidden(linkForm);
  });

  function displayHidden(form) {
    form
      .querySelectorAll(`input:not(:checked)`)
      .forEach((checkedInput) => (checkedInput.checked = true));
    form.dispatchEvent(new Event('change'));
  }

  function hideAllButOne(form, inputs, filterName) {
    inputs.forEach((input) => (input.checked = filterName === input.name));
    form.dispatchEvent(new Event('change'));
  }
});
