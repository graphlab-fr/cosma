const form = document.querySelector('form');

(function () {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        btn.disabled = true;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        const result = window.api.saveConfigOptionTypeRecord(data.name, data.color, data.action);

        const input = form.elements[0];

        if (result === true) {
            input.setCustomValidity('');
            window.api.closeWindow();
        }
        else {
            input.setCustomValidity(result);
            btn.disabled = false;
        }

        input.reportValidity();
    })
})()