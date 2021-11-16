/**
 * @file Manage the view saving & loading.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

/**
 * Take 'view' object values & encode them on base64
 * (no ACSII caracters are allowed)
 * @returns {string} - base64 string
 */

function registerView() {
    const activeFiltersNames = getActiveFilterNames();

    const viewObj = {
        recordId: view.openedRecordId,
        filters: ((activeFiltersNames.length === 0) ? undefined : activeFiltersNames)
    }

    if (focus.focusedNodeId) {
        viewObj.focus = {
            fromRecordId: focus.focusedNodeId,
            level: focus.range.value
        };
    }

    let key = JSON.stringify(viewObj);
    key = window.btoa(key);
    key = encodeURIComponent(key);
    return key;
}

/**
 * Copy registerView() output on clipboard
 */

function saveView() {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = registerView();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

/**
 * Update 'view' object values from a encoded base64 string
 * @param {HTMLElement} viewBtn - The HTML button, container of the view data
 */

function changeView(viewBtn) {
    if (viewBtn.dataset.active === "true") {
        // if click on a current active view button to unactivate it
        viewBtn.dataset.active = false;
        resetView();
        return;
    }

    // if click on another view buttonto activate it
    unactiveLastView();

    viewBtn.dataset.active = true;

    let key = viewBtn.dataset.view;
    // base64 string contain an encoded image from the 'view' object
    key = decodeURIComponent(key);
    key = window.atob(key);
    key = JSON.parse(key);

    if (key.filters) {
        setFilters(key.filters); }
    
    if (key.focus) {
        openRecord(key.focus.fromRecordId, false);
        focus.init(key.focus.fromRecordId);
        focus.set(key.focus.level);

        return;
    }

    if (key.recordId) {
        openRecord(key.recordId, false); }
}

/**
 * Remove the border of the last activated view button
 * and its effect
 */

function unactiveLastView() {
    const lastBtn = document.querySelector('[data-view][data-active="true"]');

    if (!lastBtn) { return; }

    lastBtn.dataset.active = false;
    resetView();
}