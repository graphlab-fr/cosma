const form = document.querySelector('form');

(function () {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const action = e.submitter.dataset.action;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        let result = true;

        switch (action) {
            case 'update':
                window.api.openModalHistoryRecordRename(data.history_record);
                break;

            default:
                result = window.api.historyAction(data.history_record, undefined, action);
                break;
        }
        
    })
})();