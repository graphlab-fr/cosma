const table = document.getElementById('table-history');

(function () {
    const tableContent = document.createDocumentFragment();

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (data) => {
        for (const eltDate of data) {
            const row = document.createElement('tr')
                , colName = document.createElement('td')
                , colTools = document.createElement('td')
                , btnOpen = document.createElement('button');

            colName.textContent = eltDate;
            btnOpen.textContent = 'Ouvrir';

            colTools.appendChild(btnOpen);

            row.appendChild(colName);
            row.appendChild(colTools);
            tableContent.appendChild(row);

            btnOpen.addEventListener('click', () => {
                window.api.send("sendCosmoscopeFromHistoryList", eltDate);
            });
        }

        table.appendChild(tableContent);
    });
    
})();