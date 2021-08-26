const {
    ipcRenderer
} = require('electron');

window.addEventListener("DOMContentLoaded", () => {
    saveView();
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