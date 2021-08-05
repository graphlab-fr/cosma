/**
 * @file Display/hide elts from the index of all records.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const indexContainer = document.getElementById('index');

/**
 * Switch between two lists from 'data-sort' containers
 * Two lists : increasing and decreasing
 */

(function () {
    const sortContainer = document.querySelectorAll('[data-sort]');
    for (const container of sortContainer) {
        const box = container.querySelectorAll('.sort-box')
            , increasing = box[0]
            , decreasing = box[1]
            , btn = container.querySelector('.sort-btn');

        let isIncreasing = true;

        btn.addEventListener('click', () => {
            if (isIncreasing) {
                btn.textContent = 'Z-A';
                increasing.classList.remove('active'); decreasing.classList.add('active');
                isIncreasing = false;
            } else {
                btn.textContent = 'A-Z';
                increasing.classList.add('active'); decreasing.classList.remove('active');
                isIncreasing = true;
            }
        });
    }
})();

/**
 * Hide items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function hideFromIndex(nodesIds) {
    for (const indexItem of nodesIds) {
        const indexItems = indexContainer.querySelectorAll('[data-index="' + indexItem + '"]')
        indexItems.forEach(elt => {
            elt.style.display = 'none';
        });
    }

    iterateCounter(counters.index, -Math.abs(nodesIds.length));
}

/**
 * Hide all items from the index list
 */

function hideAllFromIndex() {
    indexContainer.querySelectorAll('[data-index]')
        .forEach(elt => {
            elt.style.display = 'none';
        });

    setCounter(counters.index, 0);
}

/**
 * Display items from the index list that correspond to the nodes ids
 * @param {array} nodeIds - List of nodes ids
 */

function displayFromIndex(nodesIds) {

    nodesIds = nodesIds.filter(function(nodeId) {
        // hidden nodes can not be displayed
        const nodeIsHidden = data.nodes.find(i => i.id === nodeId).hidden;
        if (nodeIsHidden === false) { return true; }
    })

    for (const indexItem of nodesIds) {
        const indexItems = indexContainer.querySelectorAll('[data-index="' + indexItem + '"]')
        indexItems.forEach(elt => {
            elt.style.display = null;
        });
    }

    iterateCounter(counters.index, nodesIds.length);
}

/**
 * Display all items from the index list
 */

 function displayAllFromIndex() {
    const indexItems = indexContainer.querySelectorAll('[data-index]');
    indexItems.forEach(elt => {
        elt.style.display = null;
    });
    
    setCounter(counters.index, indexItems.length / 2);
}