const form = document.getElementById('form-update-link-type');

(function () {

const inputName = form.querySelector('input[name="name"]')
    , inputColor = form.querySelector('input[name="color"]')
    , inputStroke = form.querySelector('select[name="stroke"]')
    , inputOriginalName = form.querySelector('input[name="originalName"]');

let originalStroke;

window.api.receive("getLinkTypeToUpdate", (data) => {
    inputName.value = data.name;
    inputColor.value = data.color;
    inputOriginalName.value = data.name;

    originalStroke = data.stroke;

    window.api.send("askLinkStokes", null);

    window.api.receive("getLinkStokes", (data) => {
        for (const stroke of data) {
    
            if (stroke === originalStroke) {
                inputStroke.insertAdjacentHTML('beforeend',
                    `<option value="${stroke}" selected>${stroke}</option>`);
    
                continue;
            }
    
            inputStroke.insertAdjacentHTML('beforeend',
                `<option value="${stroke}">${stroke}</option>`);
        }
    });
})

})();

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

const output = form.querySelector('output')
    , submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true;

    let data = new FormData(form);
    data = Object.fromEntries(data);

    window.api.send("sendUpdateLinkTypeToConfig", data);

    window.api.receive("confirmUpdateLinkTypeFromConfig", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;

        if (response.isOk === false) {
            submitBtn.disabled = false;
        }
    });
})

})();