const {
    ipcRenderer
} = require('electron');

window.addEventListener("DOMContentLoaded", () => {
    saveView();
    menu();
});

function saveView () {
    const viewInterface = document.querySelector('.menu-view')
        , btn = document.getElementById('view-save')
        , counter = viewInterface.querySelector('.badge')
        , container = viewInterface.querySelector('div');

    btn.removeAttribute('hidden');

    btn.addEventListener('click', () => {
        ipcRenderer.send('askNewViewModal', null);

        ipcRenderer.once('confirmViewRegistration', (event, response) => {
            container.insertAdjacentHTML('beforeend',
            `<button class="btn" data-view="${response.data.key}" data-active="false" onclick="changeView(this)">
                ${response.data.name}
            </button>`);

            counter.textContent = Number(counter.textContent) + 1;
        });
    })
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

    btnCosmoscopeNew.disabled = true;

    setTimeout(() => {
        btnCosmoscopeNew.disabled = false;
    }, 800);

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