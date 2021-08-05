/**
 * @file Open/close the records container on call and page loading.
 * @author Guillaume Brioudes
 * @copyright MIT License ANR HyperOtlet
 */

const recordContainer = document.getElementById('record-container');

/**
 * Open the record reading panel & show one
 * @param {array} id - Record/node id
 * @param {boolean} history - If history must be actualised, true by default
 */

function openRecord(id, history = true) {

    const recordContent = document.getElementById(id);

    if (!recordContent) { return; }

    if (view.openedRecordId !== undefined) {
        // hide last record
        document.getElementById(view.openedRecordId)
            .classList.remove('active');
    }

    // open records container
    recordContainer.classList.add('active');
    // adjust record view
    recordContainer.scrollTo({ top: 0 });

    // show record
    recordContent.classList.add('active')

    view.openedRecordId = id;
    id = Number(id);

    // reset nodes highlighting
    unlightNodes();
    highlightNodes([id]);

    if (history) {
        // page's <title> become record's name
        const recordTitle = recordContent.querySelector('h1').textContent;
        historique.actualiser(id, recordTitle);
    }

}

/**
 * Close the record reading panel & the opended one
 */

function closeRecord() {
    recordContainer.classList.remove('active');
    document.getElementById(view.openedRecordId).classList.remove('active');
    view.openedRecordId = undefined;

    unlightNodes();
}

/**
 * Open a record at page load if his id follow a '#' as '#20200801210302'
 */

window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.substr(1);
    if (hash) { openRecord(hash); }
});