const form = document.getElementById('form-rename-view');

(function () {

    const inputName = form.querySelector('input[name="name"]')
        , inputOriginalName = form.querySelector('input[name="originalName"]');

    window.api.receive("getViewToUpdate", (viewName) => {
        inputName.value = viewName;
        inputOriginalName.value = viewName;
    });

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
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        window.api.send("sendUpdateViewToConfig", data);
    
        window.api.receive("confirmUpdateViewFromConfig", (response) => {
            output.textContent = response.consolMsg;
            output.dataset.valid = response.isOk;
    
            if (response.isOk === false) {
                submitBtn.disabled = false;
            }
        });
    })
    
    })();