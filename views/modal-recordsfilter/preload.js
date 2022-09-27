/**
 * @file Script on main window loading
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

let config = ipcRenderer.sendSync('get-config-options');
const folksonomy = ipcRenderer.sendSync('get-project-current-folksonomy');

let recordsTags, recordsMetas;

window.addEventListener("DOMContentLoaded", () => {
    metasSelect = document.querySelector('select[name="meta"]');
    valueDatalist = document.getElementById('values_database');
    metasGroupOther = document.querySelector('.other_metas');

    changeSelectableValues();
    setGroupOtherOptions(Object.keys(folksonomy.metas));
    metasSelect.addEventListener('change', changeSelectableValues);
});

contextBridge.exposeInMainWorld('api',
    {
        saveConfigOptionRecordsFilter: (meta, value) => ipcRenderer.sendSync('save-config-option-recordsfilter', meta, value, undefined, 'add')
    }
);

function changeSelectableValues() {
    switch (metasSelect.value) {
        case 'type':
            setValues(Object.keys(config.record_types));
            break;
        case 'tags':
            if (folksonomy.tags) {
                setValues(Object.keys(folksonomy.tags));
            }
            break;
        default:
            if (folksonomy.metas) {
                setValues(folksonomy.metas[metasSelect.value]);
            }
            break;
    }
}

function setValues(values) {
    valueDatalist.innerHTML = '';

    for (const value of values) {
        valueDatalist.insertAdjacentHTML('beforeend',
        `<option value="${value}" />`);
    }
}

function setGroupOtherOptions(options) {
    metasGroupOther.innerHTML = '';

    if (options.length === 0) {
        metasGroupOther.setAttribute('hidden', true);
        return;
    }

    metasGroupOther.removeAttribute('hidden');

    for (const option of options) {
        metasGroupOther.insertAdjacentHTML('beforeend',
        `<option value="${option}">${option}</option>`);
    }
}