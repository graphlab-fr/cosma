const form = document.getElementById('form-config');

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

const output = form.querySelector('output');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = new FormData(form);
    data = Object.fromEntries(data);
    data = serializeData(data);

    window.api.send("sendConfigOptions", data);

    window.api.receive("confirmConfigRegistration", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;
    });
})

})();

/**
 * Serialize data for the Config model
 * Assign form fields to config options
 * Several input must be serialize to an array for one option like types
 * @param {object} - Data from config form
 * @return {object} - Data serialized
 */

function serializeData (data) {

    if (data['graph_highlight_on_hover'] !== undefined && data['graph_highlight_on_hover'] === 'on') {
        data['graph_highlight_on_hover'] = true;
    } else {
        data['graph_highlight_on_hover'] = false;
    }

    if (data['graph_arrows'] !== undefined && data['graph_arrows'] === 'on') {
        data['graph_arrows'] = true;
    } else {
        data['graph_arrows'] = false;
    }

    return data;
}

(function () {

window.api.send("askConfig", null);

window.api.receive("getConfig", (response) => {
    if (response.isOk === true) {
        for (const option in response.data) {

            if (option === 'record_types') {
                setRecordTypeTable(response.data[option]);
                continue;
            }

            if (option === 'link_types') {
                continue;
            }

            const input = form.querySelector(`[name="${option}"]`);

            if (!input) { continue; }

            if (['graph_arrows', 'graph_highlight_on_hover'].includes(option)) {

                switch (response.data[option]) {
                    case true:
                        input.checked = true;
                        continue;
                    case false:
                        input.checked = false;
                        continue;
                }
            }
            
            input.value = response.data[option];
        }
    }
});

})();

function setRecordTypeTable (recordTypes) {
    const typeContainer = document.getElementById('add-type-record')
        , tableBody = typeContainer.querySelector('tbody')
        , btnAdd = typeContainer.querySelector('button[data-fx="add"]');

    const tableBodyContent = document.createDocumentFragment();

    for (const type in recordTypes) {
        tableBodyContent.appendChild(
            getRecordTypeRow(type, recordTypes[type])
        );
    }

    tableBody.appendChild(tableBodyContent);

    btnAdd.addEventListener('click', () => {
        window.api.send("askNewRecordTypeModal", null);

        window.api.receive("confirmNewRecordTypeFromConfig", (response) => {
            tableBodyContent.appendChild(
                getRecordTypeRow(response.data.name, response.data.color)
            );

            tableBody.appendChild(tableBodyContent);
        });
    });
}

function getRecordTypeRow (typeName, typeColor) {
    const row = document.createElement('tr')
        , colName = document.createElement('td')
        , colColor = document.createElement('td')
        , colTools = document.createElement('td')
        , btnUpdate = document.createElement('button')
        , btnDelete = document.createElement('button');

    colName.textContent = typeName;
    colColor.style.backgroundColor = typeColor;
    btnUpdate.textContent = 'Modif.';
    btnUpdate.setAttribute('type', 'button');
    btnDelete.textContent = 'Suppr.';
    btnDelete.setAttribute('type', 'button');
    colTools.appendChild(btnUpdate);
    colTools.appendChild(btnDelete);

    row.appendChild(colName);
    row.appendChild(colColor);
    row.appendChild(colTools);

    btnDelete.addEventListener('click', () => {
        window.api.send("askDeleteRecordType", { name: typeName });

        window.api.receive("confirmDeleteRecordTypeFromConfig", (response) => {
            if (response.isOk === true) {
                row.remove();
            }
        });
    });

    btnUpdate.addEventListener('click', () => {
        window.api.send("askUpdateRecordTypeModal", { name: typeName, color: typeColor });

        window.api.receive("confirmUpdateRecordTypeFromConfig", (response) => {
            if (response.isOk === true) {
                colName.textContent = response.data.name;
                colColor.style.backgroundColor = response.data.color;
                console.log(colColor);
            }
        });
    });

    return row;
}