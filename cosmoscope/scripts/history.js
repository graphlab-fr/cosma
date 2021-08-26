/**
 * @file History of navigation between records.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

/**
 * Navigation history entries managment
 * @namespace
*/
const historique = {
    /**
     * Add a new entry into history and change page title
     * @param {number} recordId - 
     * @param {string} recordTitle - 
     */
    actualiser: function(recordId, recordTitle) {
        // url as <filePath>/cosmoscope.html#<recordId>
        const url = new URL('#' + recordId, window.location);

        // add record to history
        if (history.state == null) {
            // if it is the first entry, we must init history
            this.init(recordId, recordTitle, url);
        }
        else {
            const timeline = history.state.hist; // past history
            timeline.push(recordId);
            history.pushState({hist : timeline}, recordTitle, url);
        }

        // change page title
        document.title = 'Cosma — ' + recordTitle;
    },
    /**
     * Add first entry into history
     * @param {number} recordId - 
     * @param {string} recordTitle - 
     * @param {string} url - File URL + #hash
     */
    init: function(recordId, recordTitle, url) {
        history.pushState({hist : [recordId]}, recordTitle, url);
    }
}

// At navigation travel, with forward/backward webbrowser's buttons
window.onpopstate = function(e) {
    if (e.state === null) { return; }
    // open record from a history entry
    const timeline = e.state.hist
        , recordId = timeline[timeline.length - 1];

    openRecord(recordId, false);
};