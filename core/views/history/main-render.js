const table = document.getElementById('table-history');

(function () {
    const tableContent = document.createDocumentFragment(),
        output = document.querySelector('output');

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const record of data) {
            const row = document.createElement('tr')
                , colName = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button')
                , btnRename = document.createElement('button')
                , btnDelete = document.createElement('button')
                , btnExport = document.createElement('button');

            colName.textContent = record.metas.name;
            btnOpen.textContent = 'Ouvrir';
            btnRename.textContent = 'Renommer';
            btnDelete.textContent = 'Supprimer';
            btnExport.textContent = 'Télécharger au format HTML';

            colTools.appendChild(btnOpen);
            colTools.appendChild(btnRename);
            colTools.appendChild(btnDelete);
            colTools.appendChild(btnExport);

            row.appendChild(colName);
            row.appendChild(colTools);
            tableContent.appendChild(row);

            btnOpen.addEventListener('click', () => {
                window.api.send("sendCosmoscopeFromHistoryList", record.id);
            });

            btnRename.addEventListener('click', () => {
                window.api.send("askRenameHistoryModal", record.id);

                window.api.receive("confirmRenameHistory", (response) => {
                    output.textContent = response.consolMsg;
                    output.dataset.valid = response.isOk;

                    colName.textContent = response.data.name;
                });
            });

            btnDelete.addEventListener('click', () => {
                window.api.send("sendHistoryToDelete", record.id);
                window.api.receive("confirmHistoryDelete", (response) => {
                    output.textContent = response.consolMsg;
                    output.dataset.valid = response.isOk;

                    if (response.isOk === true) {
                        row.remove();
                    }
                });
            });

            btnExport.addEventListener('click', () => {
                window.api.send("askCosmoscopeExportFromHistory", record.id);
            });
        }

        table.appendChild(tableContent);
    });
    
})();