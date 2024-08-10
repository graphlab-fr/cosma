import { displayNodesAll, setNodesDisplaying } from './graph.js';
import filterPriority from './filterPriority.js';
import hotkeys from 'hotkeys-js';

window.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLFormElement} */
  const form = document.getElementById('tags-form');

  if (!form) return;

  /** @type {HTMLSelectElement} */
  const sortSelect = document.querySelector('.menu-tags .sorting-select');

  /** @type {[string, string[]][]} */
  const tags = Object.entries(tagList);

  const tagsSorting = sorting.tags;
  let tagsState;

  /**
   * Default state
   */

  sortTags();
  changeTagsState();

  /**
   * User actions state
   */

  sortSelect.addEventListener('change', sortTags);
  form.addEventListener('change', changeTagsState);

  /**
   * Search params state
   */

  const { searchParams } = new URL(window.location);
  const tagsFromSearch = searchParams.get('tags')?.split('-');

  if (tagsFromSearch?.length) {
    for (const tagName of tagsFromSearch) {
      const input = form.querySelector(`input[name="${tagName}"]`);
      input.checked = true;
    }
    form.dispatchEvent(new Event('change'));
  }

  function sortTags() {
    /** @type {HTMLLIElement[]} */
    const labelElements = form.querySelectorAll('label');
    const [sortingKey, direction] = sortSelect.value.split(':');

    for (let i = 0; i < labelElements.length; i++) {
      let order = tagsSorting[i][sortingKey];
      const elt = labelElements[i];

      if (direction === 'reverse') {
        order = labelElements.length - 1 - order;
      }

      elt.style.order = order;
    }
  }

  function changeTagsState() {
    let formState = new FormData(form);
    formState = Object.fromEntries(formState);

    const nodeIdsToDisplay = new Set();

    tagsState = tags
      .filter(([name]) => !!formState[name])
      .forEach(([, nodes]) => {
        nodes.forEach((id) => nodeIdsToDisplay.add(id));
      });

    if (nodeIdsToDisplay.size === 0) {
      displayNodesAll(filterPriority.filteredByTag);
      return;
    }

    setNodesDisplaying(Array.from(nodeIdsToDisplay), filterPriority.filteredByTag);
  }

  hotkeys('alt+r', (e) => {
    e.preventDefault();
    form
      .querySelectorAll(`input:checked`)
      .forEach((checkedInput) => (checkedInput.checked = false));
    form.dispatchEvent(new Event('change'));
  });

  window.activeTag = function (name) {
    /** @type {HTMLInputElement} */
    const input = form.querySelector(`input[name="${name}"]`);
    input.checked = !input.checked;
    form.dispatchEvent(new Event('change'));
  };
});
