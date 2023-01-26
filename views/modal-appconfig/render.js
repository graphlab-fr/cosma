const form = document.querySelector('form');

(function () {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let data = new FormData(form);
        data = Object.fromEntries(data);

        if (data.select_langage) {
            window.api.setLangage(data.select_langage);
        }
        if (data.devtools) {
            window.api.setDevTools(e.target.checked);
        }
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