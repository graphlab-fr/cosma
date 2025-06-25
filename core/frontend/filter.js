/**
 * @file Select filters elts and activate them by the ids them contain.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import { setNodesDisplaying, updateLinkVisibility } from './graph.js';

window.addEventListener('DOMContentLoaded', () => {
  // Node Types Selector
  /** @type {HTMLFormElement} */
  const form = document.getElementById('types-form');
  /** @type {HTMLInputElement[]} */
  const inputs = form.querySelectorAll('input');
  /** @type {[string, string[]][]} */
  const types = Object.entries(typeList);

  // Link Type Selector
  /** @type {HTMLFormElement} */
  const linkForm = document.getElementById('link-types-form');
  /** @type {HTMLInputElement[]} */
  const linkInputs = linkForm ? linkForm.querySelectorAll('input') : [];
  /** @type {[string, {linkKeys: string[], active: boolean, color: string}][]} */
  const linkTypes = Object.entries(linkTypeList);

  /**
   * Default state
   */

  for (const [name] of types) {
    form.querySelector(`[name="${name}"]`).checked = true;
  }
  changeTypesState();

  for (const [name, { active }] of linkTypes) {
    // Check if the element exists before trying to set checked
    linkForm.querySelector(`[name="${name}"]`).checked = active; // Use the 'active' flag passed from template.js
  }
  changeLinkTypesState(); // Initial call for links

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

  const linkFiltersFromSearch = searchParams.get('link-filters')?.split('-');
  if (linkFiltersFromSearch?.length) {
    for (const [name] of linkTypes) {
      linkForm.querySelector(`[name="${name}"]`).checked = linkFiltersFromSearch.includes(name);
    }
    changeLinkTypesState();
  }

  /**
   * User actions state
   */

  form.addEventListener('change', changeTypesState);
  if (linkForm) {
    linkForm.addEventListener('change', changeLinkTypesState); // Add listener for link form
  }

  function changeTypesState() {
    let formState = new FormData(form);
    formState = Object.fromEntries(formState);

    const nodeIdsToDisplay = new Set();

    types
      .filter(([name]) => !!formState[name])
      .forEach(([, nodes]) => {
        nodes.forEach((id) => nodeIdsToDisplay.add(id));
      });

    setNodesDisplaying(Array.from(nodeIdsToDisplay));
  }

  function changeLinkTypesState() {
    let formState = new FormData(linkForm);
    formState = Object.fromEntries(formState);

    // Get the *names* of the link types that are currently checked
    const activeLinkTypes = new Set(
      linkTypes.filter(([name]) => !!formState[name]).map(([name]) => name)
    );

    // Call the graph update function with the set of active type names
    updateLinkVisibility(activeLinkTypes);
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
    const { name: filterName } = input;

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

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    displayHidden();
  });

  function displayHidden(targetForm) {
    targetForm
      .querySelectorAll(`input:not(:checked)`)
      .forEach((checkedInput) => (checkedInput.checked = true));
    targetForm.dispatchEvent(new Event('change'));
  }

  function hideAllButOne(targetForm, targetInputs, filterName) {
    targetInputs.forEach((input) => (input.checked = filterName === input.name));
    targetForm.dispatchEvent(new Event('change'));
  }
});
