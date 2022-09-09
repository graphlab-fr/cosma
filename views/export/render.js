const form = document.getElementById('form-export');
const output = form.querySelector('output');
const submitBtn = form.querySelector('button[type="submit"]');

(function () {

    form.addEventListener('submit', (e) => {
        e.preventDefault(e);

        submitBtn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        output.textContent = 'Chargement en cours…';

        window.api.exportCosmoscope({
            minify: (data['minify'] !== undefined),
            citeproc: (data['citeproc'] !== undefined),
            css_custom: (data['css_custom'] !== undefined)
        });
    });
})();


window.api.exportResult(({ isOk, message }) => {
    document.body.style.cursor = null;
    if (isOk) {
        window.close();
    } else {
        output.textContent = 'Erreur : ' + message;
        submitBtn.disabled = false;
    }
    output.textContent = null;
});

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

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            window.close();
        }
    });
})();