(function () {

    const form = document.getElementById('form-record')
        , output = form.querySelector('output');

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