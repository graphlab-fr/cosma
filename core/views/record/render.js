const form = document.getElementById('form-record');

(function () {
    const firstInput = form.querySelector('input');
    firstInput.focus();
})();

(function () {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        btn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        window.api.recordAdd(data.title, data.type, data.tags);

        window.api.recordBackup((response) =>  {
            if (response.isOk === false) {

                if (response.invalidField !== undefined) {
                    const input = form.querySelector(`[name="${response.invalidField}"]`)
                    input.setCustomValidity(response.msg);
                    input.reportValidity();
                }
    
                btn.disabled = false;
                return;
            }

            window.close();
        });
    })
})();

(function () {
    document.querySelector('.window-close')
        .addEventListener('click', () => {
            window.close();
        })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            window.close();
        }
    });
})();