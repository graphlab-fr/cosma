const form = document.getElementById('form-export');

(function () {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault(e);

        submitBtn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        const result = window.api.exportCosmoscope({
            minify: (data['minify'] !== undefined),
            citeproc: (data['citeproc'] !== undefined),
            css_custom: (data['css_custom'] !== undefined)
        })

        if (result === false) {
            submitBtn.disabled = false;
        } else {
            window.close();
        }
    });
})();

(function () {
    const btnRequestPath = document.querySelector('[data-path]')
        , inputExportPath = btnRequestPath.previousElementSibling;

    btnRequestPath.addEventListener('click', () => {
        window.api.dialogRequestDirPath(inputExportPath.name);
    });

    window.api.getDirPathFromDialog((response) => {
        if (response.isOk === false) {
            return; }

        inputExportPath.value = response.data;

        saveExportPath();
    });

    inputExportPath.addEventListener('input', () => {
        saveExportPath();
    });

    function saveExportPath () {
        const result = window.api.saveConfigOption(inputExportPath.name, inputExportPath.value);
    
        if (result === true) { inputExportPath.setCustomValidity(''); }
        else { inputExportPath.setCustomValidity(result); }

        inputExportPath.reportValidity();
    }
})();

(function () {
    document.querySelector('.window-close')
        .addEventListener('click', () => {
            window.close();
        })
})();