const form = document.getElementById('form-project');

(function () {

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { action } = e.submitter.dataset;

        switch (action) {
            case 'new-project':
                window.api.openNewProjectModal();
                break;
        }

        // let data = new FormData(form);
        // data = Object.fromEntries(data);

        // const result = window.api.saveConfigOptionView(data.name, data.initial_name, data.key, data.action);

        // const input = form.elements[0];

        // if (result === true) {
        //     input.setCustomValidity('');
        //     window.close();
        // }
        // else {
        //     input.setCustomValidity(result);
        //     btn.disabled = false;
        // }

        // input.reportValidity();
    })
})();

window.api.newProjectResult((response) => {
    if (response.isOk) {
        window.close();
    }
})