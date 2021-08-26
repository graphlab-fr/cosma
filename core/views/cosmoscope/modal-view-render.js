const form = document.getElementById('form-cosmoscope-view');
let isReady = false;

(function () {

    const output = form.querySelector('output')
        , submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;

        if (isReady === false) { return; }
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        window.api.send("sendViewName", data);
    
        window.api.receive("confirmViewRegistration", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;

            if (response.isOk === false) {
                submitBtn.disabled = false;
            }
        });
    })
    
})();

(function () {

    window.api.receive("getNewViewKey", (key) => {
        form.querySelector('input[name="key"]')
            .value = key;

        isReady = true;
    });

})();

(function () {

    const firstInput = form.querySelector('input');
    firstInput.focus();
    
})();