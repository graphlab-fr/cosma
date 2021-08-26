const table = document.getElementById('table-history')
    , output = document.querySelector('output');

(function () {
    const tableContent = document.createDocumentFragment();

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const record of data) {
            const row = document.createElement('tr')
                , colDate = document.createElement('td')
                , colDescription = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button')
                , btnRename = document.createElement('button')
                , btnReport = document.createElement('button')
                , btnReveal = document.createElement('button');

            colDate.textContent = record.metas.date;
            colDescription.textContent = record.metas.description;
            btnOpen.textContent = 'Ouvrir';
            btnRename.textContent = 'Renommer';
            btnReport.textContent = 'Rapport d’erreurs';
            btnReveal.textContent = 'Révéler';

            colTools.appendChild(btnOpen);
            colTools.appendChild(btnRename);
            colTools.appendChild(btnReport);
            colTools.appendChild(btnReveal);

            switch (record.metas.isTemp) {
                case true:
                    const btnKeep = document.createElement('button')
                    btnKeep.textContent = 'Conserver';
                    colTools.appendChild(btnKeep);

                    btnKeep.addEventListener('click', () => {
                        window.api.send("sendHistoryToKeep", record.id);

                        window.api.receive("confirmHistoryKeep", (response) => {
                            output.textContent = response.consolMsg;
                            output.dataset.valid = response.isOk;

                            if (response.isOk === true) {
                                btnKeep.textContent = 'Supprimer';
                                btnKeep.addEventListener('click', deleteRow);
                            }
                        });
                    })
                    break;
            
                case false:
                    const btnDelete = document.createElement('button')
                    btnDelete.textContent = 'Supprimer';
                    colTools.appendChild(btnDelete);

                    btnDelete.addEventListener('click', deleteRow);
                    break;
            }

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

            btnReport.addEventListener('click', () => {
                window.api.send("askHistoryReportModal", record.id);
            })

            btnReveal.addEventListener('click', () => {
                window.api.send("askRevealCosmoscopeFromHistoryFolder", record.id);
                
            });

            function deleteRow () {
                window.api.send("sendHistoryToDelete", record.id);

                window.api.receive("confirmHistoryDelete", (response) => {
                    output.textContent = response.consolMsg;
                    output.dataset.valid = response.isOk;

                    if (response.isOk === true) {
                        row.remove();
                    }
                });
            }
        }

        table.appendChild(tableContent);
    });
    
})();

(function () {

    const btn = document.getElementById('btn-delete-all');

    btn.addEventListener('click', () => {
        window.api.send("askHistoryDeleteAll", null);

        window.api.receive("confirmHistoryDeleteAll", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;

            if (response.isOk === true) {
                table.querySelectorAll('tr')
                    .forEach(tr => {
                        tr.remove();
                    });
            }
        });
    })

})();