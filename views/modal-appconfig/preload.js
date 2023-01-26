/**
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

const langages = [
    {
        flag: 'fr',
        label: 'Français'
    },
    {
        flag: 'en',
        label: 'Anglais'
    }
];
const currentLangage = 'fr';

window.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById('langage-select');

    for (const { flag, label } of langages) {
        if (flag === currentLangage) {
            select.insertAdjacentHTML('afterbegin',
            `<option value="${flag}" selected >${label}</option>`);
            continue;
        }
        select.insertAdjacentHTML('afterbegin',
        `<option value="${flag}">${label}</option>`);
    }
});

contextBridge.exposeInMainWorld('api',
    {
        setLangage: (flag) => console.log(flag),
        setDevTools: (bool) => console.log(bool),
    }
);