const form = document.querySelector('form');

(function () {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    })

    form.addEventListener('input', (e) => {
        e.preventDefault();
        
        let data = new FormData(form);
            data = Object.fromEntries(data);

            switch (e.target.name) {
                case 'lang':
                    window.api.saveOption(e.target.name, data.lang);
                    break;

                case 'devtools':
                    window.api.saveOption(e.target.name, e.target.checked);
                    break;
            }
    })

})();

(function () {
    document.querySelector('.window-close')
        .addEventListener('click', () => {
            window.close();
        })

    document.querySelector('button[type="submit"]')
        .addEventListener('click', () => {
            window.close();
        })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            window.close();
        }
    });
})();