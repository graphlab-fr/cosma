const form = document.getElementById('form-add-record-type');

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

    window.api.send("sendNewRecordTypeToConfig", data);
    
    window.api.receive("confirmNewRecordTypeFromConfig", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;

        if (response.isOk === false) {
            submitBtn.disabled = false;
        }
    });
})

})();