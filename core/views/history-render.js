const table = document.getElementById('table-history');

(function () {
    const tableContent = document.createDocumentFragment(),
        output = document.querySelector('output');

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const date of data) {
            const row = document.createElement('tr')
                , colName = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button')
                , btnDelete = document.createElement('button');

            colName.textContent = date.forHuman;
            btnOpen.textContent = 'Ouvrir';
            btnDelete.textContent = 'Supprimer';

            colTools.appendChild(btnOpen);
            colTools.appendChild(btnDelete);

            row.appendChild(colName);
            row.appendChild(colTools);
            tableContent.appendChild(row);

            btnOpen.addEventListener('click', () => {
                window.api.send("sendCosmoscopeFromHistoryList", date.forSystem);
            });

            btnDelete.addEventListener('click', () => {
                window.api.send("sendHistoryToDelete", date.forSystem);
                window.api.receive("confirmHistoryDelete", (response) => {
                    output.textContent = response.consolMsg;
                    output.dataset.valid = response.isOk;

                    if (response.isOk === true) {
                        row.remove();
                    }
                });
            });
        }

        table.appendChild(tableContent);
    });
    
})();