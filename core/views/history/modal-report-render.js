const container = document.querySelector('main')
    , counter = document.getElementById('error-counter');

(function () {

    window.api.receive("getHistoryReport", (data) => {
        if (data === null) { return; }

        let nb = 0

        for (const reportSection in data) {
            if (data[reportSection].length === 0) { continue; }

            nb += data[reportSection].length;

            const list = '<li>' + data[reportSection].join('</li><li>') + '</li>';

            const html =
            `<h2>${reportSection}</h2>

            <ul>
                ${list}
            </ul>`;

            container.insertAdjacentHTML('beforeend', html)
        }

        counter.textContent = nb;
    });
    
})();