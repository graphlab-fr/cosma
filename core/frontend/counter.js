function setCounters() {
  const indexBadge = document.getElementById('index-counter');
  const typesListBadges = document.querySelectorAll('.menu-types-list .badge');

  let nbNodesNotHidden = 0;
  const typesNotHidden = {};

  for (const { hidden, type } of data.nodes) {
    if (hidden === true) {
      continue;
    }
    nbNodesNotHidden += 1;
    if (typesNotHidden[type]) {
      typesNotHidden[type] += 1;
    } else {
      typesNotHidden[type] = 1;
    }
  }

  for (const badge of typesListBadges) {
    const typeName = badge.previousElementSibling.name;
    setCounter(badge, typesNotHidden[typeName] || 0);
  }
  setCounter(indexBadge, nbNodesNotHidden);
}

/**
 *
 * @param {HTMLSpanElement} counterElt
 * @param {number} value
 * @exemple
 * ```
 * const indexCounter = document.getElementById('index-counter');
 * setCounter(indexCounter, 10);
 * ```
 */

function setCounter(counterElt, value) {
  let [actualValue, maxValue] = counterElt.textContent.split('/', 2);
  actualValue = Number(actualValue);
  maxValue = Number(maxValue) || actualValue;

  if (value === maxValue) {
    counterElt.textContent = maxValue;
  } else {
    counterElt.textContent = `${value}/${maxValue}`;
  }
}

export { setCounters };
