const form = document.querySelector('form');

(function () {
    const firstInput = form.querySelector('input');
    firstInput.focus();
})();

(function () {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        btn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);
        window.api.addNewProject(data);
        return;

        const result = window.api.saveConfigOptionRecordsFilter(
            data.meta,
            data.value
        );

        const input = form.elements[0];

        if (result === true) {
            input.setCustomValidity('');
            window.close();
        }
        else {
            input.setCustomValidity(result);
            btn.disabled = false;
        }

        input.reportValidity();
    })
})();

window.api.getNewProjectResult((response) => {
    if (response.isOk) {
        window.close();
    }
});

(function () {
    const filesSelect = document.getElementById('files-select');

    filesSelect.addEventListener('change', () => {
        const { value: pathTypeSelected } = filesSelect;
        const pathInputs = form.querySelectorAll(`[data-path]`);
        for (const pathInput of pathInputs) {
            const { path: pathType } = pathInput.dataset;
            if (pathType === pathTypeSelected) {
                pathInput.parentElement.style.display = null;
            } else {
                pathInput.parentElement.style.display = 'none';
            }
        }
    });
})();

(function () {
    const btnRequestPath = document.querySelectorAll('[data-path]');

    for (const btn of btnRequestPath) {
        const input = btn.previousElementSibling;

        if (btn.dataset.path === 'directory') {
            btn.addEventListener('click', () => {
                window.api.dialogRequestDirPath(input.name);
            });
            continue;
        }

        btn.addEventListener('click', () => {
            window.api.dialogRequestFilePath(input.name, btn.dataset.path);
        });
    }
})();

window.api.getDirPathFromDialog(setValueFromDialog);
window.api.getFilePathFromDialog(setValueFromDialog);

function setValueFromDialog (response) {
    if (response.isOk === false) {
        return; }

    const input = document.querySelector(`input[name="${response.target}"]`);
    input.value = response.data;
    const inputEvent = new Event('input');
    input.dispatchEvent(inputEvent);
}

// function saveInput (input, value = input.value, name = input.name) {
//     const result = window.api.saveConfigOption(name, value);

//     if (result === true) { input.setCustomValidity(''); }
//     else { input.setCustomValidity(result); }

//     input.reportValidity();
// }

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