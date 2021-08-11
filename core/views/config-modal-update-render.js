const form = document.getElementById('form-update-record-type');

(function () {

const inputName = form.querySelector('input[name="name"]')
    , inputColor = form.querySelector('input[name="color"]')
    , inputOriginalName = form.querySelector('input[name="originalName"]');

window.api.receive("getRecordTypeToUpdate", (data) => {
    inputName.value = data.name;
    inputOriginalName.value = data.name;
    inputColor.value = data.color;
});

})();

/**
 * Form submition & feedback : send data and after display the response
 */

(function () {

const output = form.querySelector('output');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = new FormData(form);
    data = Object.fromEntries(data);

    window.api.send("sendUpdateRecordTypeToConfig", data);

    window.api.receive("confirmUpdateRecordTypeFromConfig", (response) => {
        output.textContent = response.consolMsg;
        output.dataset.valid = response.isOk;
    });
})

})();