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
let langages = ipcRenderer.sendSync('get-langages');

let inputs, tableTypesLink, tableTypesRecord, tableView, selectLang;

window.addEventListener("DOMContentLoaded", () => {
    inputs = document.querySelectorAll('input');
    tableTypesRecord = document
        .getElementById('form-type-record')
        .querySelector('tbody')
    tableTypesLink = document
        .getElementById('form-type-link')
        .querySelector('tbody')
    tableView = document
        .getElementById('form-view')
        .querySelector('tbody')
    selectLang = document.querySelector('select[name="lang"]')

    setConfigView();
});

ipcRenderer.on('reset-config', () => {
    config = ipcRenderer.sendSync('get-config-options');
    setConfigView();
});

contextBridge.exposeInMainWorld('api',
    {
        saveConfigOption: (name, value) => ipcRenderer.sendSync('save-config-option', name, value),
        saveConfigOptionTypeRecord: (name, nameInitial, color, action) => ipcRenderer.sendSync('save-config-option-typerecord', name, nameInitial, color, action),
        saveConfigOptionTypeLink: (name, nameInitial, color, stroke, action) => ipcRenderer.sendSync('save-config-option-typelink', name, nameInitial, color, stroke, action),
        openModalTypeRecord: (recordType, action) => ipcRenderer.send('open-modal-typerecord', recordType, action),
        openModalTypeLink: (recordType, action) => ipcRenderer.send('open-modal-typelink', recordType, action),
        saveConfigOptionView: (name, nameInitial, key, action) => ipcRenderer.sendSync('save-config-option-view', name, nameInitial, key, action),
        openModalView: (view, action) => ipcRenderer.send('open-modal-view', view, action),
        dialogRequestDirPath: (name) => ipcRenderer.send('dialog-request-dir-path', name),
        dialogRequestFilePath: (name, fileExtension) => ipcRenderer.send('dialog-request-file-path', name, fileExtension),
        getFilePathFromDialog: (fx) => ipcRenderer.on('get-dir-path-from-dialog', (event, response) => fx(response)),
        getDirPathFromDialog: (fx) => ipcRenderer.on('get-file-path-from-dialog', (event, response) => fx(response))
    }
);

function setConfigView () {
    for (const input of inputs) {
        switch (input.type) {
            case 'text':
                input.value = config[input.name];
                break;

            case 'color':
                input.value = config[input.name];
                break;

            case 'number':
                input.value = config[input.name];
                break;

            case 'checkbox':
                input.checked = config[input.name];
                break;
        }
    }

    tableTypesRecord.innerHTML = '';

    for (const recordType in config.record_types) {
        tableTypesRecord.insertAdjacentHTML('beforeend',
        `<tr>
            <td><input type="radio" name="record_types" value="${recordType}"></td>
            <td>${recordType}</td>
            <td style="background-color: ${config.record_types[recordType]}"></td>
        </tr>`);
    }

    tableTypesLink.innerHTML = '';

    for (const linkType in config.link_types) {
    
        let strokeCss;
        switch (config.link_types[linkType].stroke) {
            case 'simple':
                strokeCss = 'solid';
                break;
            case 'dash':
                strokeCss = 'dashed';
                break;
            default:
                strokeCss = config.link_types[linkType].stroke;
                break;
        }

        tableTypesLink.insertAdjacentHTML('beforeend',
        `<tr>
            <td><input type="radio" name="link_types" value="${linkType}"></td>
            <td>${linkType}</td>
            <td>
                <span class="stroke-exemple" style="border: 3px ${config.link_types[linkType].color} ${strokeCss}"></span>
            </td>
        </tr>`);
    }

    tableView.innerHTML = '';

    for (const view in config.views) {
        tableView.insertAdjacentHTML('beforeend',
        `<tr>
            <td><input type="radio" name="view" value="${view}"></td>
            <td>${view}</td>
        </tr>`);
    }

    selectLang.innerHTML = '';

    for (const lang in langages) {
        if (lang === config.lang) {
            selectLang.insertAdjacentHTML('beforeend',
            `<option value="${lang}" selected>${langages[lang]}</option>`);
            continue;
        }

        selectLang.insertAdjacentHTML('beforeend',
        `<option value="${lang}">${langages[lang]}</option>`);
    }
}