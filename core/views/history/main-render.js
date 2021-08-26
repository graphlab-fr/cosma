const table = document.getElementById('table-history');

(function () {
    const tableContent = document.createDocumentFragment(),
        output = document.querySelector('output');

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const record of data) {
            const row = document.createElement('tr')
                , colDate = document.createElement('td')
                , colDescription = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button')
                , btnRename = document.createElement('button')
                , btnDelete = document.createElement('button')
                , btnReport = document.createElement('button')
                , btnExport = document.createElement('button');

            colDate.textContent = record.metas.date;
            colDescription.textContent = record.metas.description;
            btnOpen.textContent = 'Ouvrir';
            btnRename.textContent = 'Renommer';
            btnDelete.textContent = 'Supprimer';
            btnReport.textContent = 'Rapport d’erreurs';
            btnExport.textContent = 'Télécharger au format HTML';

            colTools.appendChild(btnOpen);
            colTools.appendChild(btnRename);
            colTools.appendChild(btnDelete);
            colTools.appendChild(btnReport);
            colTools.appendChild(btnExport);

            row.appendChild(colDate);
            row.appendChild(colDescription);
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

                    colDescription.textContent = response.data.description;
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

            btnReport.addEventListener('click', () => {
                window.api.send("askHistoryReportModal", record.id);
            })

            btnExport.addEventListener('click', () => {
                window.api.send("askCosmoscopeExportFromHistory", record.id);
            });
        }

        table.appendChild(tableContent);
    });
    
})();

(function () {

    const btn = document.getElementById('btn-delete-all');

    btn.addEventListener('click', () => {
        window.api.send("askHistoryDeleteAll", null);

        window.api.receive("confirmHistoryDeleteAll", (response) => {
            if (response.isOk === true) {
                table.querySelectorAll('tr')
                    .forEach(tr => {
                        tr.remove();
                    });
            }
        });
    })

})();