const form = document.getElementById('form-record');

(function () {

    const output = form.querySelector('output');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        window.api.send("sendRecordContent", data);
    
        window.api.receive("confirmRecordSaving", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;
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