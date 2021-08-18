const form = document.getElementById('form-add-record-type');

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

    const output = form.querySelector('output');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let data = new FormData(form);
        data = Object.fromEntries(data);

        window.api.send("sendNewLinkTypeToConfig", data);

        window.api.receive("confirmNewLinkTypeFromConfig", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;
        });
    })

})();

(function () {

    window.api.send("askLinkStokes", null);

    window.api.receive("getLinkStokes", (data) => {
        const inputSelect = form.querySelector('select[name="stroke"]');

        for (const stroke of data) {
            inputSelect.insertAdjacentHTML('beforeend',
                `<option value="${stroke}">${stroke}</option>`);
        }
    });

})();