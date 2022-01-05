const {
    ipcRenderer
} = require('electron');

let config = ipcRenderer.sendSync('get-config-options');

window.addEventListener("DOMContentLoaded", () => {
    views();
    menu();
});

function views () {
    const viewMenu = document.querySelector('.menu-view')
        , btn = document.getElementById('view-save')
        , counter = viewMenu.querySelector('.badge')
        , container = viewMenu.querySelector('div');

    resetViewMenu();

    btn.addEventListener('click', () => {
        ipcRenderer.send('open-modal-view', undefined, 'add');
    });

    ipcRenderer.on('reset-views', (event) => {
        config = ipcRenderer.sendSync('get-config-options');
        resetViewMenu();
    });

    function resetViewMenu () {
        container.innerHTML = '';

        for (const view in config.views) {
            container.insertAdjacentHTML('beforeend',
                `<button class="btn" data-view="${config.views[view]}" data-active="false" onclick="changeView(this)">
                    ${view}
                </button>`);
        }

        counter.textContent = Object.keys(config.views).length;
    }
}

function menu () {
    const container = document.getElementById('menu-electron');
    container.removeAttribute('hidden');

    const btnPageReload = document.getElementById('electron-page-reload')
        , btnBack = document.getElementById('electron-back')
        , btnForward = document.getElementById('electron-forward')
        , btnShare = document.getElementById('electron-share')
        , btnRecordNew = document.getElementById('electron-record-new')
        , btnCosmoscopeNew = document.getElementById('electron-cosmoscope-new');

    btnPageReload.addEventListener('click', reload);
    btnBack.addEventListener('click', back);
    btnForward.addEventListener('click', forward);
    btnShare.addEventListener('click', share);
    btnRecordNew.addEventListener('click', recordNew);
    btnCosmoscopeNew.addEventListener('click', cosmoscopeNew);
}

function reload () { ipcRenderer.send('askReload', null); }

function back () { ipcRenderer.send('askBack', null); }

function forward () { ipcRenderer.send('askForward', null); }

function share () { ipcRenderer.send('askShare', null); }

function recordNew () { ipcRenderer.send('askRecordNew', null); }

function cosmoscopeNew () { ipcRenderer.send('askCosmoscopeNew', null); }

ipcRenderer.on('open-about', (event) => {
    document.querySelector('.btn-about').click();
})

ipcRenderer.on('open-help', (event) => {
    document.querySelector('.btn-help').click();
})