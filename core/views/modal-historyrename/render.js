const form = document.querySelector('form');

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

        const result = window.api.historyAction(data.record_id, data.description, 'update');

        const input = form.elements[0];

        if (result === true) {
            input.setCustomValidity('');
            window.close();
        }
        else {
            input.setCustomValidity(result);
            btn.disabled = false;
        }

        input.reportValidity();
    })
})();

(function () {
    document.querySelector('.window-close')
        .addEventListener('click', () => {
            window.close();
        })
})();