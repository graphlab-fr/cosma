/**
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const preferences = ipcRenderer.sendSync('get-preferences-options');
const langages = ipcRenderer.sendSync('get-langages');

const currentLangage = 'fr';

window.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.querySelector('[name="lang"]');

    for (const [flag, label] of Object.entries(langages)) {
        if (flag === preferences.lang) {
            langSelect.insertAdjacentHTML('afterbegin',
            `<option value="${flag}" selected >${label}</option>`);
            continue;
        }
        langSelect.insertAdjacentHTML('afterbegin',
        `<option value="${flag}">${label}</option>`);
    }

    /** @type {HTMLInputElement} */
    const devtoolsInput = document.querySelector('[name="devtools"]');
    devtoolsInput.checked = preferences.devtools;
});

contextBridge.exposeInMainWorld('api',
    {
        setLangage: (flag) => console.log(flag),
        setDevTools: (bool) => console.log(bool),
        saveOption: (name, value) => ipcRenderer.sendSync('save-preferences-option', name, value),
    }
);