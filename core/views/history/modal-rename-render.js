const form = document.getElementById('form-rename-history');
let isReady = false;

(function () {

    const firstInput = form.querySelector('input');
    firstInput.focus();

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

        if (isReady === false) { return; }
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        window.api.send("sendNewHistoryName", data);
    
        window.api.receive("confirmRenameHistory", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;

            if (response.isOk === false) {
                submitBtn.disabled = false;
            }
        });
    })
    
})();

/**
 * Get and set as value the name of the history record
 */

(function () {

    window.api.receive("getMetasHistory", (metas) => {
        console.log(metas);
        form.querySelector('input[name="description"]')
            .value = metas.description;
        form.querySelector('input[name="id"]')
            .value = metas.id;

        isReady = true;
    });

})();