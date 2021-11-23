const form = document.getElementById('form-config');

(function () {

    window.api.send("askOptionLangageFromConfig", null);
    
    window.api.receive("getOptionLangageFromConfig", (data) => {
        const select = form.querySelector('select[name="lang"]');
    
        for (const lang in data) {
            select.insertAdjacentHTML('beforeend', `<option value="${lang}">${data[lang]}</option>`);
        }
    });
    
})();

/**
 * Autocomplete form from the current config
 * For each option from the config, find the input from by its name
 * and then set its value, or activate a specific function
 */

(function () {

window.api.send("askConfig", null);

window.api.receive("getConfig", (data) => {
    for (const option in data) {

        if (option === 'record_types') {
            setRecordTypeTable(data[option]);
            continue;
        }

        if (option === 'link_types') {
            setLinkTypeTable(data[option]);
            continue;
        }

        if (option === 'lang') {
            const selectOptions = form.querySelectorAll('select[name="lang"] option');
            
            for (const selectOption of selectOptions) {
                if (selectOption.value === data[option]) {
                    selectOption.setAttribute('selected', '');
                }
            }
            continue;
        }

        if (option === 'views') {
            views = Object.keys(data[option]);

            for (let i = 0; i < views.length; i++) {
                generateInputView(i, views[i])
            }

            sendViews();
            continue;
        }

        const input = form.querySelector(`[name="${option}"]`);

        if (!input) { continue; }

        if (typeof data[option] === 'boolean') {
            input.checked = data[option];
            continue;
        }
        
        input.value = data[option];
    }

    autosaveForm();
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

function autosaveForm () {

    const inputs = form.querySelectorAll('input, textarea, select')
        , output = form.querySelector('output')

    for (const input of inputs) {
        const label = input.parentElement;

        let originValue, interval;

        if (input.getAttribute('type') === 'checkbox') {
            originValue = input.checked;

            input.addEventListener('click', () => {
                label.dataset.state = 'not-saved';

                save(!originValue)
                    .then((inputValue) => {
                        originValue = inputValue;
                    })
                    .catch((inputValue) => {
                        originValue = !inputValue;
                        input.checked = !inputValue;
                    });
            })

            continue;
        }

        input.addEventListener('focus', (e) => {
            originValue = input.value;
    
            input.addEventListener('input', () => {
                label.dataset.state = 'not-saved';
            })
    
            interval = setInterval(() => {
                save()
                    .then((inputValue) => {
                        originValue = inputValue;
                    })
                    .catch((inputValue) => {
                        input.value = originValue;
                    });
            }, 100);
        });
    
        input.addEventListener('blur', (e) => {
            clearInterval(interval);

            save()
                .then((inputValue) => {
                    originValue = inputValue;
                })
                .catch((inputValue) => {
                    input.value = originValue
                });
        });

        function save (value = input.value) {
            return new Promise((success, reject) => {
                console.log(input, input.value);
                if (value === originValue) {
                    label.dataset.state = 'saved';
                    clearInterval(interval);
                    return;
                }
    
                let data = {};
                data[input.name] = value;

                if (input.name === 'metas_keywords') {
                    data[input.name] = value.split(',');
                }
    
                window.api.send("sendConfigOptions", data);
    
                window.api.receiveOnce("confirmConfigRegistration", (response) => {
                    if (response.isOk) {
                        label.dataset.state = 'saved';
                        // originValue = value;
                        success(value);
                    } else {
                        label.dataset.state = 'save-error';
                        // input.value = originValue;
                        output.textContent = response.consolMsg;
                        output.dataset.valid = response.isOk;
                        reject(value);
                        return false;
                    }
                });
            })
        }
    }

};

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

        window.api.receiveOnce("confirmNewRecordTypeFromConfig", (response) => {
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
    btnUpdate.textContent = 'Modifier…';
    btnUpdate.setAttribute('type', 'button');
    btnDelete.textContent = 'Supprimer';
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

    btnUpdate.addEventListener('click', update);
    row.addEventListener('dblclick', update);

    function update () {
        window.api.send("askUpdateRecordTypeModal", { name: typeName, color: typeColor });

        window.api.receive("confirmUpdateRecordTypeFromConfig", (response) => {
            if (response.isOk === true) {
                typeName = response.data.name;
                typeColor = response.data.color;

                colName.textContent = typeName;
                colColor.style.backgroundColor = typeColor;
            }
        });
    }

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

        window.api.receiveOnce("confirmNewLinkTypeFromConfig", (response) => {
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
        , colStroke = document.createElement('td')
        , colTools = document.createElement('td')
        , lineStrokeExemple = document.createElement('span')
        , btnUpdate = document.createElement('button')
        , btnDelete = document.createElement('button');

    colName.textContent = typeName;
    lineStrokeExemple.classList.add('stroke-exemple')
    lineStrokeExemple.style.border = getBorderExemple(typeColor, typeStroke);
    colStroke.appendChild(lineStrokeExemple);
    btnUpdate.textContent = 'Modifier…';
    btnUpdate.setAttribute('type', 'button');
    btnDelete.textContent = 'Supprimer';
    btnDelete.setAttribute('type', 'button');
    colTools.appendChild(btnUpdate);
    colTools.appendChild(btnDelete);

    row.appendChild(colName);
    row.appendChild(colStroke);
    row.appendChild(colTools);

    btnUpdate.addEventListener('click', update);
    row.addEventListener('dblclick', update);

    function update () {
        window.api.send("askUpdateLinkTypeModal", { name: typeName, color: typeColor, stroke: typeStroke });

        window.api.receive("confirmUpdateLinkTypeFromConfig", (response) => {
            if (response.isOk === true) {
                typeName = response.data.name;
                typeColor = response.data.color;
                typeStroke = response.data.stroke;

                colName.textContent = typeName;
                lineStrokeExemple.style.border = getBorderExemple(typeColor, typeStroke);
            }
        });
    }

    btnDelete.addEventListener('click', () => {
        window.api.send("askDeleteRecordType", { name: typeName });

        window.api.receive("confirmDeleteLinkTypeFromConfig", (response) => {
            if (response.isOk === true) {
                row.remove();
            }
        });
    });

    function getBorderExemple (typeColor, typeStroke) {
        switch (typeStroke) {
            case 'simple':
                return `3px solid ${typeColor}`;

            case 'double':
                return `3px double ${typeColor}`;

            case 'dotted':
                return `3px dotted ${typeColor}`;

            case 'dash':
                return `3px dashed ${typeColor}`;
        }

        return `3px solid ${typeColor}`;
    }

    return row;
}

(function () {

const btnDialog = document.getElementById('dialog-path-fileorigin')
    , input = form.querySelector('[name="files_origin"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askFilesOriginPath", null);

    input.focus();

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

    input.focus();

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

    input.focus();

    window.api.receive("getCslPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();

(function () {

const btnDialog = document.getElementById('dialog-path-locales')
    , input = form.querySelector('[name="bibliography_locales"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askLocalesPath", null);

    input.focus();

    window.api.receive("getLocalesPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();

(function () {

const btnDialog = document.getElementById('dialog-path-css')
    , input = form.querySelector('[name="custom_css_path"]');

btnDialog.addEventListener('click', () => {
    window.api.send("askCustomCssPath", null);

    input.focus();

    window.api.receive("getCustomCssPath", (response) => {
        if (response.isOk === true) {
            input.value = response.data[0];
        }
    });
});

})();

const tableView = document.getElementById('table-history');

function generateInputView (viewId, viewName) {
    const label = document.createElement('label')
        , input = document.createElement('input')
        , spanName = document.createElement('span');

    spanName.textContent = viewName;
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'hist-record');
    input.setAttribute('value', viewId);

    label.appendChild(input);
    label.appendChild(spanName);

    tableView.appendChild(label);

    return label;
}

function sendViews () {
    const form = document.getElementById('form-views');

    let submitBtn;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn = document.activeElement;

        if (submitBtn.dataset.action === 'delete-all') {
            submitBtn.disabled = true;

            window.api.send("askDeleteAllView", null);

            window.api.receiveOnce("confirmDeleteAllViewFromConfig", (response) => {
                submitBtn.disabled = false;

                if (response.isOk === true) { tableView.innerHTML = ''; }
            });
            return;
        }

        const input = tableView.querySelector('input:checked');

        if (!input) { return; }

        submitBtn.disabled = true;

        const label = input.parentElement
            , spanName = input.nextElementSibling
            , id = input.value;

        switch (submitBtn.dataset.action) {
            case 'update':
                window.api.send("askUpdateViewModal", spanName.textContent);

                window.api.receiveOnce("confirmUpdateViewFromConfig", (response) => {
                    submitBtn.disabled = false;

                    if (response.isOk === true) {
                        spanName.textContent = response.data;
                    }
                });
                break;

            case 'delete':
                window.api.send("askDeleteViewFromConfig", spanName.textContent);

                window.api.receiveOnce("confirmDeleteViewFromConfig", (response) => {
                    submitBtn.disabled = false;

                    if (response.isOk === true) {
                        label.remove();
                    }
                });
                break;
        }

        console.log(submitBtn);
    })
}