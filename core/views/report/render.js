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