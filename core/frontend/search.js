import Fuse from 'fuse.js';
import hotkeys from 'hotkeys-js';
import { nodes } from './graph.js';

const fuse = new Fuse([], {
  includeScore: false,
  keys: ['label'],
});

window.addEventListener('DOMContentLoaded', () => {
  let maxResultNb = 5,
    resultList = [],
    selectedResult = 0;

  const input = document.getElementById('search');
  const resultContainer = document.getElementById('search-result-list');

  input.addEventListener('focus', () => {
    fuse.setCollection(nodes.filter(({ hidden }) => hidden === 0));

    input.addEventListener('input', () => {
      resultContainer.innerHTML = '';
      selectedResult = 0;
      resultList = [];

      if (input.value === '') {
        return;
      }

      resultList = fuse.search(input.value);

      for (let i = 0; i < Math.min(maxResultNb, resultList.length); i++) {
        let {
          item: { id, label, types },
        } = resultList[i];

        const resultElement = document.createElement('li');
        resultElement.classList.add('search-result-item');
        resultElement.innerHTML = `
        <a href="#${id}">
          <span class="record-type-points">
              ${types.map((type) => `<span style="color:var(--n_${type})">⬤</span>`).join(' ')}
          </span>
          <span class="record-title">${label}</span>
        </a>`;

        resultContainer.appendChild(resultElement);
      }

      activeOutline();
    });
  });

  hotkeys('s', (e) => {
    e.preventDefault();
    input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (resultList.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();

        if (selectedResult > 0) {
          removeOutlineElt();
          selectedResult--;
          activeOutline();
        }

        if (selectedResult === 0) {
          input.focus();
        }

        break;
      case 'ArrowDown':
        e.preventDefault();

        if (selectedResult === maxResultNb - 1 || selectedResult === resultList.length - 1) {
          break;
        }

        removeOutlineElt();
        selectedResult++;
        activeOutline();

        if (selectedResult === 1) {
          input.blur();
        }

        break;
      case 'Enter':
        e.preventDefault();
        window.location.hash = resultList[selectedResult].item.id;
        input.blur();
        break;
    }
  });

  function activeOutline() {
    resultContainer.childNodes[selectedResult].classList.add('outline');
  }

  function removeOutlineElt() {
    resultContainer.childNodes[selectedResult].classList.remove('outline');
  }
});
