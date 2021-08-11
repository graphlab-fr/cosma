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

    window.api.send("sendNewRecordTypeToConfig", data);

    console.log('coucou');
    
    window.api.receive("confirmNewRecordTypeFromConfig", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;
    });
})

})();