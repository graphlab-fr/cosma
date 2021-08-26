const form = document.getElementById('form-record');

(function () {

const firstInput = form.querySelector('input');
firstInput.focus();

})();

(function () {

    const output = form.querySelector('output')
        , submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        window.api.send("sendRecordContent", data);
    
        window.api.receive("confirmRecordSaving", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;

            if (response.isOk === false) {
                submitBtn.disabled = false;
            }
        });
    })
    
})();

(function () {

const recordTypeSelect = form.querySelector('select[name="type"]')
    , recordTypeSelectContent = document.createDocumentFragment();

window.api.send("askRecordTypes", null);

window.api.receive("getRecordTypes", (response) => {
    for (const recordType in response.data) {
        const option = document.createElement('option');
        option.value = recordType;
        option.textContent = recordType;

        recordTypeSelectContent.appendChild(option);
    }

    recordTypeSelect.appendChild(recordTypeSelectContent);
});

})();