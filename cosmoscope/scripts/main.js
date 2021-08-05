/**
 * @file Global vars about nodes, record & graph displaying. Logo animation.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

/** @namespace */
const view = {
        /**
         * List of ids from highlighted nodes
         * @type {array}
         * @default
         */
        highlightedNodes: [],
        /**
         * If the focus mode is activated
         * @type {boolean}
         * @default
         */
        focusMode: false,
        /**
         * Id from the current diplayed record
         * @type {array}
         * @default
         */
        openedRecordId: undefined,
        /**
         * Name 'data-tag' from the activated tag
         * @type {string}
         * @default
         */
        activeTag: undefined,
        /**
         * Zoom and position on the graph
         * @type {object}
         * @default
         */
        position: {x: 0, y: 0, zoom: 1}
    };

function resetView() {
    if (view.openedRecordId) { closeRecord(); }
    zoomReset();
    activeAllFilters();
    if (focus.isActive) { focus.disable(); }
    unactiveAllTags();
    displayAllFromIndex();
    unactiveLastView();
}

/**
 * Cosma logo animation onclick
 */

(function (){
    const roll = document.getElementById('cosma-roll');

    if (!roll) { return; }

    roll.parentElement.addEventListener('click', () => {
        roll.classList.add('anim');
        roll.addEventListener('animationend', () => { roll.classList.remove('anim'); })
    });
})();