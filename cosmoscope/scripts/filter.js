/**
 * @file Select filters elts and activate them by the ids them contain.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

let filterAltMode = false;

/**
 * Toggle a filter from his checkbox
 * @param {bool} isChecked - Checkbox boolean : checked or not
 * @param {string} nodeIdsList - List of nodes id to filter, separeted by comas
 * @param {HTMLElement} input - The filter element from DOM
 * @param {bool} fromElt - If function is activeted from a 'onchange' attribute
 */

function filter(isChecked, nodeIdsList, input, fromElt = false) {

    nodeIdsList = parseIdsString(nodeIdsList);

    if (isChecked === true) {
        displayNodes(nodeIdsList);
        input.checked = true;
    } else {
        hideNodes(nodeIdsList);
        input.checked = false;
    }
    
    if (fromElt && pressedKeys.Alt) {
        if (filterAltMode && isChecked == false) {
            setFilters(getFilterNames()); // active all types
            filterAltMode = false;
            return;
        }
        setFilters([input.name]); // first time alt+click
        filterAltMode = true; // active alt+click mode
    } else {
        filterAltMode = false; // after last time alt+click
    }
}

/**
 * Activate filters by their name and if their are not already activated
 * Unactive others filters if their are not already unactivated
 * @param {array} filtersNameToActivate - List of filter names
 */

function setFilters(filtersNameToActivate) {
    let filtersNames = Array.from(document.querySelectorAll('[data-filter]'))
        .map(filter => filter.name);

    let filtersToUnactivate = filtersNames.filter(function(filterName) {
        if (filtersNameToActivate.includes(filterName)) {
            return false; }
        if (getUnactiveFilterNames().includes(filterName)) {
            return false; }

        return true;
    });

    filtersNameToActivate = filtersNameToActivate.filter(function(filterName) {
        if (getActiveFilterNames().includes(filterName)) {
            return false; }

        return true;
    });

    for (const filterName of filtersToUnactivate) {
        let filterElt = document.querySelector('[data-filter][name="' + filterName + '"]')
            , data = filterElt.dataset.filter;

        filter(false, data, filterElt);
    }

    for (const filterName of filtersNameToActivate) {
        let filterElt = document.querySelector('[data-filter][name="' + filterName + '"]')
            , data = filterElt.dataset.filter;

        filter(true, data, filterElt);
    }
}

/**
 * Get all filters name from the page
 * @returns {array} - Filter names list
 */

function getFilterNames() {
    return filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .map(filterElt => filterElt.name);
}

/**
 * Get active filters name
 * @returns {array} - Filter names list
 */

function getActiveFilterNames() {
    let filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === true)

    return filterElts.map(filterElt => filterElt.name);
}

/**
 * Get unactive filters name
 * @returns {array} - Filter names list
 */

function getUnactiveFilterNames() {
    let filterElts = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === false)

    return filterElts.map(filterElt => filterElt.name);
}

function activeAllFilters() {
    Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === false)
        .forEach(filterElt => {
            filter(true, filterElt.dataset.filter, filterElt);
        });
}

/**
 * Get nodes id hidden by filters into an array
 * @returns {array} - Nodes id list
 */

function getNodesHideByFilter() {
    const unactiveFilters = Array.from(document.querySelectorAll('[data-filter]'))
        .filter(filterElt => filterElt.checked === false);

    return filtersIds = unactiveFilters
        .map(filterElt => parseIdsString(filterElt.dataset.filter)).flat();
}

/**
 * Get nodes id list (array of numbers) from a string
 * @returns {array} - Ids array
 */

function parseIdsString(idsString) {
    return idsString.split(',').map(id => Number(id));
}