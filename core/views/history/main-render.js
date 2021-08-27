const table = document.getElementById('table-history')
    , output = document.querySelector('output');

(function () {
    const tableContent = document.createDocumentFragment();

    window.api.send("askHistoryList", null);

    window.api.receive("getHistoryList", (historyRecords) => {

        if (historyRecords.length > 0) {
            historyRecords.forEach(generateInput);
        }

        send();

    });
    
})();

function generateInput (record) {
    const label = document.createElement('label')
        , input = document.createElement('input')
        , spanDate = document.createElement('span')
        , spanDescription = document.createElement('span');

    spanDate.textContent = record.metas.date;
    spanDescription.textContent = record.metas.description;
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'hist-record');
    input.setAttribute('value', record.id);

    label.appendChild(input);
    label.appendChild(spanDate);
    label.appendChild(spanDescription);

    if (table.firstChild) {
        table.insertBefore(label, table.firstChild);
    } else {
        table.appendChild(label);
    }
    

    return label;
}

function send () {
    const form = document.getElementById('form-history');

    let submitBtn;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let id = null;

        submitBtn = document.activeElement;

        const input = table.querySelector('input:checked')

        if (input) {
            const label = input.parentElement
            , spanDate = input.nextElementSibling
            , spanDescription = spanDate.nextElementSibling;
            
            id = input.value;
        }

        switch (submitBtn.dataset.action) {
            case 'delete-all':
                window.api.send("askHistoryDeleteAll", null);

                window.api.receive("confirmHistoryDeleteAll", (response) => {
                    promptResponse(response);

                    if (response.isOk === true) {
                        table.innerHTML = '';
                    }
                });
                return;

            case 'add-current':
                submitBtn.disabled = true;

                window.api.send("askHistoryToKeep", null);

                window.api.receive("confirmHistoryKeep", (response) => {
                    promptResponse(response);

                    if (response.isOk === true) {
                        generateInput(response.data);
                    }
                });
                return;
        }

        if (id === null) {
            output.textContent = "Veuillez sélectionner une entrée."
            output.dataset.valid = null;
            return;
        }

        switch (submitBtn.dataset.action) {
            case 'update':
                submitBtn.disabled = true;

                window.api.send("askRenameHistoryModal", id);

                window.api.receive("confirmRenameHistory", (response) => {
                    promptResponse(response);

                    if (response.isOk === true) {
                        spanDescription.textContent = response.data.description;
                    }
                });
                return;

            case 'delete':
                submitBtn.disabled = true;

                window.api.send("sendHistoryToDelete", id);

                window.api.receive("confirmHistoryDelete", (response) => {
                    promptResponse(response);

                    if (response.isOk === true) {
                        label.remove();
                    }
                });
                return;

            case 'open-cosmoscope':
                window.api.send("sendCosmoscopeFromHistoryList", id);
                return;

            case 'open-report':
                window.api.send("askHistoryReportModal", id);
                return;

            case 'open-finder':
                window.api.send("askRevealCosmoscopeFromHistoryFolder", id);
                return;
        }
    })

    function promptResponse (response) {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;
        submitBtn.disabled = false;
    }
}

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