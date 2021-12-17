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

        let data = new FormData(form);
        data = Object.fromEntries(data);

        switch (form.id) {
            case 'form-type-record':
                manageTypeRecord(data, action);
                break;

            case 'form-views':
                
                break;
        }
    })

    if (['form-type-record', 'form-views'].includes(form.id)) {
        continue; }

    form.addEventListener('input', (e) => {
        const input = e.target;

        saveInput(input);
    })
}

function saveInput (input) {
    const result = window.api.saveConfigOption(input.name, input.value);

    if (result === true) { input.setCustomValidity(''); }
    else { input.setCustomValidity(result); }

    input.reportValidity();
}

function manageTypeRecord (recordType, action) {
    console.log(recordType, action);
}