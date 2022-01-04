/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const linkType = ipcRenderer.sendSync('get-linktype')
    , action = ipcRenderer.sendSync('get-action')
    , config = ipcRenderer.sendSync('get-config-options')
    , linkStrokes = ipcRenderer.sendSync('get-link-strokes');

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input[name="action"]').value = action;

    const selectStroke = document.querySelector('select[name="stroke"]');
    for (const stroke of linkStrokes) {
        if (linkType !== undefined && stroke.id === config.link_types[linkType].stroke) {
            selectStroke.insertAdjacentHTML('beforeend',
            `<option value="${stroke.id}" selected>${stroke.name}</option>`);
            continue;
        }

        selectStroke.insertAdjacentHTML('beforeend',
        `<option value="${stroke.id}">${stroke.name}</option>`);
    }

    if (linkType === undefined) {
       return; }

    document.querySelector('input[name="name"]').value = linkType;
    document.querySelector('input[name="initial_name"]').value = linkType;
    document.querySelector('input[name="color"]').value = config.link_types[linkType].color;
});

contextBridge.exposeInMainWorld('api',
    { saveConfigOptionTypeLink: (name, nameInitial, color, stroke, action) => ipcRenderer.sendSync('save-config-option-typelink', name, nameInitial, color, stroke, action) }
);