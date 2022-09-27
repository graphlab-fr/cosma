/**
 * @file Configuration page animation
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

let sections = {}
    , sectionDisplayed = undefined;

(function () {

    const sectionsElts = document.querySelectorAll('[data-section]');

    for (let i = 0; i < sectionsElts.length; i++) {
        const sectionElt = sectionsElts[i];
        
        sections[sectionElt.dataset.section] = {
            btn: sectionElt,
            target: document.getElementById(`section-${sectionElt.dataset.section}`)
        }

        sectionElt.addEventListener('click', () => {
            sectionVisibility(i, 'display'); })

        sectionElt.addEventListener('focus', () => {
            sectionVisibility(i, 'display'); })
    }

})();

/**
 * Get the button and the targeted section from the page
 * by an identifier
 * @param {string|number} sectionIdoNumber
 * @returns {object|undefined}
 */

function getSection (sectionIdoNumber) {
    if (
        Number(sectionIdoNumber) !== NaN &&
        Number(sectionIdoNumber) >= 0
    )
    {
        const i = sectionIdoNumber;
        return Object.values(sections)[i];
    }

    return sections[sectionIdoNumber];
}

/**
 * Display a section and active its button
 * @param {string|number} sectionIdoNumber
 * @param {'display'|'hide'} action
 * @returns {boolean}
 */

function sectionVisibility (sectionIdoNumber, action) {
    const section = getSection(sectionIdoNumber);

    if (section === undefined) {
        return false; }

    switch (action) {
        case 'display':
            sectionVisibility(sectionDisplayed, 'hide');

            section.btn.classList.add('active');
            section.target.classList.add('visible');
            sectionDisplayed = sectionIdoNumber;
            break;

        case 'hide':
            section.btn.classList.remove('active');
            section.target.classList.remove('visible');
            break;
    }

    
}

sectionVisibility(0, 'display');

const forms = document.querySelectorAll('form');

for (const form of forms) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const action = e.submitter.dataset.action;
        let input;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        switch (form.id) {
            case 'form-type-record':
                input = Array.from(form.elements)
                    .find(input => input.value === data['record_types']);

                manageTypeRecord(data, action, input);
                break;

            case 'form-type-link':
                input = Array.from(form.elements)
                    .find(input => input.value === data['link_types']);

                manageTypeLink(data, action, input);
                break;

            case 'form-records-filter':
                input = Array.from(form.elements)
                    .find(input => input.value === data['record_filters']);

                manageRecordsFilter(data, action, input);
                break;

            case 'form-view':
                input = Array.from(form.elements)
                    .find(input => input.value === data['view']);

                manageView(data, action, input);
                break;
        }
    })

    if (['form-type-record', 'form-type-link', 'form-records-filter', 'form-view'].includes(form.id)) {
        continue; }

    form.addEventListener('input', (e) => {
        const { target: input } = e;

        if (!input.name) { return; }

        if (input.type === 'checkbox') {
            saveInput(input, (input.checked === true));
            return;
        }

        if (input.type === 'number') {
            saveInput(input, input.valueAsNumber);
            return;
        }

        saveInput(input);
    })
}

function saveInput (input, value = input.value, name = input.name) {
    const result = window.api.saveConfigOption(name, value);

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

function manageTypeRecord (formData, action, input) {
    let result = true;

    switch (action) {
        case 'add':
            window.api.openModalTypeRecord(formData.record_types, action);
            break;

        case 'delete-all':
            result = window.api.saveConfigOptionTypeRecord(formData.record_types, undefined, undefined, undefined, action)
            break;
    }

    if (input === undefined) { return; }

    switch (action) {
        case 'update':
            window.api.openModalTypeRecord(formData.record_types, action);
            break;

        case 'delete':
            result = window.api.saveConfigOptionTypeRecord(formData.record_types, undefined, undefined, undefined, action)
            break;
    }

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

function manageTypeLink (formData, action, input) {
    let result = true;

    switch (action) {
        case 'add':
            window.api.openModalTypeLink(formData.link_types, action);
            break;

        case 'delete-all':
            result = window.api.saveConfigOptionTypeLink(formData.link_types, undefined, undefined, undefined, action)
            break;
    }

    if (input === undefined) { return; }

    switch (action) {
        case 'update':
            window.api.openModalTypeLink(formData.link_types, action);
            break;

        case 'delete':
            result = window.api.saveConfigOptionTypeLink(formData.link_types, undefined, undefined, undefined, action)
            break;
    }

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

function manageRecordsFilter (formData, action, input) {
    let result = true;

    switch (action) {
        case 'add':
            window.api.openModalRecordsFilter();
            break;

        case 'delete-all':
            result = window.api.saveConfigOptionRecordsFilter(undefined, undefined, undefined, action)
            break;
    }

    if (input === undefined) { return; }

    switch (action) {
        case 'delete':
            result = window.api.saveConfigOptionRecordsFilter(undefined, undefined, Number(formData.record_filters), action)
            break;
    }

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

function manageView (formData, action, input) {
    let result = true;

    switch (action) {
        case 'update':
            window.api.openModalView(formData.view, action);
            break;

        case 'delete':
            result = window.api.saveConfigOptionView(formData.view, undefined, undefined, action)
            break;

        case 'delete-all':
            result = window.api.saveConfigOptionView(formData.view, undefined, undefined, action)
            break;
    }

    if (input === undefined) { return; }

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

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

    saveInput(input);
}

(function () {
    const form = document.getElementById('form-origin');
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
    const form = document.getElementById('form-node-size');
    const nodeSizeMethodSelect = form.querySelector('select');

    nodeSizeMethodSelect.addEventListener('change', () => {
        const { value: methodSelected } = nodeSizeMethodSelect;
        const divs = form.querySelectorAll(`[data-method]`);
        for (const div of divs) {
            const { method } = div.dataset;
            if (method === methodSelected) {
                div.style.display = null;
            } else {
                div.style.display = 'none';
            }
        }
    });
})();

function customKeywordsInput() {
    const tagsInput = document.querySelector('input[name="keywords"]');
    tagger(tagsInput,{ allow_spaces: true });
    tagsInput.addEventListener('input', () => {
        saveInput(tagsInput, tagsInput.value.split(','));
    });
}

function customRecordMetasInput() {
    const metasInput = document.querySelector('input[name="record_metas"]');
    tagger(metasInput, { allow_spaces: true, completion: { list: () => Promise.resolve(window.api.getRecordMetas()) } });
    metasInput.addEventListener('input', () => {
        saveInput(metasInput, metasInput.value.split(','));
    });
}

window.addEventListener("DOMContentLoaded", () => {
    customKeywordsInput();
    customRecordMetasInput();
});