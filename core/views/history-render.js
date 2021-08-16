const table = document.getElementById('table-history');

(function () {
    const tableContent = document.createDocumentFragment();

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const date of data) {
            const row = document.createElement('tr')
                , colName = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button');

            colName.textContent = date.forHuman;
            btnOpen.textContent = 'Ouvrir';

            colTools.appendChild(btnOpen);

            row.appendChild(colName);
            row.appendChild(colTools);
            tableContent.appendChild(row);

            btnOpen.addEventListener('click', () => {
                window.api.send("sendCosmoscopeFromHistoryList", date.forSystem);
            });
        }

        table.appendChild(tableContent);
    });
    
})();