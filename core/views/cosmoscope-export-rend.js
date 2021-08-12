const form = document.getElementById('form-cosmoscope-export');

(function () {

    const output = form.querySelector('output');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        let data = new FormData(form);
        data = Object.fromEntries(data);

        console.log(data);
    
        window.api.send("sendExportOptions", data);
    
        window.api.receive("confirmExport", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;
        });
    })
    
})();

(function () {

    const btnDialog = document.getElementById('dialog-path-export')
        , input = form.querySelector('[name="export_path"]');
    
    btnDialog.addEventListener('click', () => {
        window.api.send("askExportPath", null);
    
        window.api.receive("getExportPath", (response) => {
            if (response.isOk === true) {
                input.value = response.data[0];
            }
        });
    });
    
})();