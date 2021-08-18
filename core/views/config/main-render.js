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
 * @param {object} data - Data from config form
 * @return {object} - Data serialized
 */

function serializeData (data) {
    data['graph_highlight_on_hover'] = booleanCheckbox(data['graph_highlight_on_hover']);
    data['graph_arrows'] = booleanCheckbox(data['graph_arrows']);
    data['history'] = booleanCheckbox(data['history']);
    data['minify'] = booleanCheckbox(data['minify']);
    data['custom_css'] = booleanCheckbox(data['custom_css']);
    data['devtools'] = booleanCheckbox(data['devtools']);

    if (data['metas_keywords'] !== '') {
        data['metas_keywords'] = data['metas_keywords'].split(',');
    }

    return data;
}

/**
 * Convert the value of a checkbox
 * if 'on' → true
 * if undefined → false
 * @param {string} option - Checkbox input value
 * @return {boolean} - Checkbox boolean value
 */

function booleanCheckbox (option) {
    if (option !== undefined && option === 'on') {
        return true; }

        return false;
}

/**
 * Autocomplete form from the current config
 * For each option from the config, find the input from by its name
 * and then set its value, or activate a specific function
 */

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
                setLinkTypeTable(response.data[option]);
                continue;
            }

            const input = form.querySelector(`[name="${option}"]`);

            if (!input) { continue; }

            if (typeof response.data[option] === 'boolean') {
                input.checked = response.data[option];
                continue;
            }
            
            input.value = response.data[option];
        }
    }
});

})();

(function () {

window.api.send("askOptionMinimumFromConfig", null);

window.api.receive("getOptionMinimumFromConfig", (data) => {
    for (const option in data) {
        form.querySelector('input[name="' + option + '"]')
            .setAttribute('min', data[option]);
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
                typeName = response.data.name;
                typeColor = response.data.color;

                colName.textContent = typeName;
                colColor.style.backgroundColor = typeColor;
            }
        });
    });

    return row;
}

function setLinkTypeTable (linkTypes) {
    const typeContainer = document.getElementById('add-type-links')
        , tableBody = typeContainer.querySelector('tbody')
        , btnAdd = typeContainer.querySelector('button[data-fx="add"]');

    const tableBodyContent = document.createDocumentFragment();

    for (const type in linkTypes) {
        tableBodyContent.appendChild(
            getLinkTypeRow(type, linkTypes[type].color, linkTypes[type].stroke)
        );
    }

    tableBody.appendChild(tableBodyContent);

    btnAdd.addEventListener('click', () => {
        window.api.send("askNewLinkTypeModal", null);

        window.api.receive("confirmNewLinkTypeFromConfig", (response) => {
            tableBodyContent.appendChild(
                getLinkTypeRow(response.data.name, response.data.color, response.data.stroke)
            );

            tableBody.appendChild(tableBodyContent);
        });
    });
}

function getLinkTypeRow (typeName, typeColor, typeStroke) {
    const row = document.createElement('tr')
        , colName = document.createElement('td')
        , colColor = document.createElement('td')
        , colStroke = document.createElement('td')
        , colTools = document.createElement('td')
        , btnUpdate = document.createElement('button')
        , btnDelete = document.createElement('button');

    colName.textContent = typeName;
    colColor.style.backgroundColor = typeColor;
    colStroke.textContent = typeStroke;
    btnUpdate.textContent = 'Modif.';
    btnUpdate.setAttribute('type', 'button');
    btnDelete.textContent = 'Suppr.';
    btnDelete.setAttribute('type', 'button');
    colTools.appendChild(btnUpdate);
    colTools.appendChild(btnDelete);

    row.appendChild(colName);
    row.appendChild(colColor);
    row.appendChild(colStroke);
    row.appendChild(colTools);

    btnUpdate.addEventListener('click', () => {
        window.api.send("askUpdateLinkTypeModal", { name: typeName, color: typeColor, stroke: typeStroke });

        window.api.receive("confirmUpdateLinkTypeFromConfig", (response) => {
            if (response.isOk === true) {
                typeName = response.data.name;
                typeColor = response.data.color;
                typeStroke = response.data.stroke;

                colName.textContent = typeName;
                colColor.style.backgroundColor = typeColor;
                colStroke.textContent = typeStroke;
            }
        });
    });

    btnDelete.addEventListener('click', () => {
        window.api.send("askDeleteRecordType", { name: typeName });

        window.api.receive("confirmDeleteLinkTypeFromConfig", (response) => {
            if (response.isOk === true) {
                row.remove();
            }
        });
    });

    return row;
}

(function () {

const btnDialog = document.getElementById('dialog-path-fileorigin')
    , input = form.querySelector('[name="files_origin"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askFilesOriginPath", null);

    window.api.receive("getFilesOriginPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();

(function () {

const btnDialog = document.getElementById('dialog-path-bibliography')
    , input = form.querySelector('[name="bibliography"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askBibliographyPath", null);

    window.api.receive("getBibliographyPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();

(function () {

const btnDialog = document.getElementById('dialog-path-csl')
    , input = form.querySelector('[name="csl"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askCslPath", null);

    window.api.receive("getCslPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();