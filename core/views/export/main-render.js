const form = document.getElementById('form-cosmoscope-export');

(function () {

    const output = form.querySelector('output');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
        data = serializeData(data);
    
        window.api.send("sendExportOptions", data);
    
        window.api.receive("confirmExport", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;
        });
    })
    
})();

function serializeData (data) {
    data['citeproc'] = booleanCheckbox(data['citeproc']);
    data['publish'] = booleanCheckbox(data['publish']);

    return data;
}

(function () {
    window.api.send("askExportOptions", null);

    window.api.receive("getExportOptions", (response) => {
        for (const input in response) {
            if (response[input] === false) {
                form.querySelector('input[name="' + input + '"]')
                    .setAttribute('disabled', true)
            }
        }
    });
})();

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

(function () {

    const input = form.querySelector('[name="export_path"]');
    
    window.api.send("askExportPathFromConfig", null);

    window.api.receive("getExportPathFromConfig", (response) => {
        if (response.isOk === true) {
            input.value = response.data;
        }
    });
    
})();

(function () {

    const btnDialog = document.getElementById('dialog-path-export')
        , input = form.querySelector('[name="export_path"]');
    
    btnDialog.addEventListener('click', () => {
        window.api.send("askExportPath", null);
    
        window.api.receive("getExportPath", (response) => {
            if (response.isOk === true) {
                input.value = response.data[0];
            }
        });
    });
    
})();