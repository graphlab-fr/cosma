/**
 * @file Activate/disable focus on a node and focus controls.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

/**
 * Display some nodes, hide all others
 * Turn on the 'focusMode'
 * @param {string} nodeIdsList - List of ids from nodes to keep displayed
 */

 function nodeFocus(nodeIdsList) {
    view.focusMode = false; // for reset display

    let idsToHide = [];

    data.nodes = data.nodes.map(function(item) {
        if (nodeIdsList.includes(item.id)) {
            // if item comes from the nodeIdsList
            item.isolated = true;
        } else {
            item.isolated = false;
            idsToHide.push(item.id);
        }
        return item;
    });

    // display nodeIds if their are not filtered
    const filteredNodes = getNodesHideByFilter();
    let idsToDisplay = nodeIdsList
        .filter(id => !filteredNodes.includes(id));

    hideNodes(idsToHide);
    view.focusMode = true;
    displayNodes(idsToDisplay);
}

/** @namespace */

const focus = {
    checkbox: document.getElementById('focus-check'),
    range: document.getElementById('focus-range'),
    isActive: false,
    focusedNodeId: undefined,
    focusedNode: undefined,
    levels: [],

    /**
     * Get focus levels from the active record and lauche first one
     * @param {string | number} focusedNodeId - Id of the current activated record
     */
    init : function(focusedNodeId = view.openedRecordId) {
        if (focusedNodeId === undefined) { this.hide(); return; }

        this.focusedNodeId = Number(focusedNodeId);
        zoomToNode(this.focusedNodeId);

        // get infos about the focused node
        this.focusedNode = document.querySelector('[data-node="' + this.focusedNodeId + '"]');
        this.focusedNode.classList.add('focus');
        highlightNodes([focusedNodeId]);
        // get focus levels and limit it
        this.levels = data.nodes.find(i => i.id === this.focusedNodeId).focus;
        this.range.setAttribute('max', this.levels.length)
        // launch use
        this.display();
        this.range.focus(); // to control range with keyboard arrows
        this.set(1);
    },

    /**
     * Reset and display and active focus inputs
     */
    display: function() {
        this.checkbox.checked = true;
        this.range.classList.add('active');
        this.range.value = 1;
    },

    /**
     * Reset and hide focus inputs
     */
    hide : function() {
        this.checkbox.checked = false;
        this.range.classList.remove('active');
        this.range.value = 1;
    },

    /**
     * Lauch a focus level
     * @param {number} level - Level number
     */
    set: function(level) {
        this.isActive = true;

        // cut the levels array to keep the targeted level and others before
        level = this.levels.slice(0, level);
        level.push([this.focusedNodeId]); // add the node id as a level
        level = level.flat(); // merge all levels as one focus

        nodeFocus(level);
    },

    /**
     * Unset focus parameters and focus
     * @param {number} level - Level number
     */
    disable : function() {
        if (this.isActive === false) { return; }

        // throw infos about the focus
        this.isActive = false;
        this.focusedNode.classList.remove('focus');
        this.focusedNode = undefined;
        this.focusedNodeId = undefined;
        this.levels = [];

        this.hide();
        resetFocus();
    }
}

focus.checkbox.addEventListener('change', () => {
    if (focus.checkbox.checked == true) {
        focus.init();
    } else {
        focus.disable();
    }
});

focus.range.addEventListener('change', () => {
    if (focus.range.value <= 1) {
        focus.range.value = 1; }

    focus.set(focus.range.value);
});

/**
 * Display nodes hidden by nodeFocus(),
 * if their are not filtered
 */

 function resetFocus() {
    view.focus = undefined;

    const filteredNodes = getNodesHideByFilter();

    const idsToDisplay = data.nodes
        .filter(item => item.isolated === false && !filteredNodes.includes(item.id))
        .map(item => item.id);

    data.nodes = data.nodes.map(function(item) {
        item.isolated = false;
        return item;
    });

    view.focusMode = false;
    displayNodes(idsToDisplay);
}