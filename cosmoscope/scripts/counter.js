/**
 * @file Counters elts and functions to change values.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const counters = {
    index: document.getElementById('index-counter'),
    tag: document.getElementById('tag-counter')
}

/**
 * Change counter display
 * @param {HTMLElement} counterElt - Elt with the original number
 * @param {number} value - Number neg. or pos. addition to original number to get the new count
 * @return {boolean} True if the counter number is max
 */

function iterateCounter(counterElt, value) {
    let counterNumber = counterElt.textContent.split('/', 2);

    if (counterNumber.length === 1) { // if there is NOT a '/' into counter text content
        counterElt.textContent = (Number(counterNumber[0]) + value) + '/' + counterNumber[0];
        return false;
    }

    if (Number(counterNumber[0]) + value === Number(counterNumber[1])) {
        counterElt.textContent = counterNumber[1];
        return true;
    }

    counterElt.textContent = (Number(counterNumber[0]) + value) + '/' + counterNumber[1]
    return false;
}

function setCounter(counterElt, value) {
    let counterNumber = counterElt.textContent.split('/', 2);

    if (counterNumber.length === 1) { // if there is NOT a '/' into counter text content
        counterElt.textContent = value + '/' + counterNumber[0];
        return false;
    }

    counterElt.textContent = value + '/' + counterNumber[1]
    return false;
}

/**
 * For each types in list, find the counter and addition his value
 * @param {object} types - List of types to change with the value to add
 */

 function setTypesCounter(types) {
    for (const typeName in types) {
        const number = types[typeName];
        const filterLabel = document.querySelector('[data-filter][name="' + typeName +'"]').parentElement;
        iterateCounter(filterLabel.querySelector('.badge'), number);
    }
}