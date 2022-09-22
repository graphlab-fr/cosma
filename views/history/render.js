const form = document.querySelector('form');

(function () {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const action = e.submitter.dataset.action;

        let data = new FormData(form);
        data = Object.fromEntries(data);

        switch (action) {
            case 'delete-all':
                window.api.historyAction(undefined, undefined, action);
                break;
        }

        if (data.history_record === undefined) {
            return; }

        data.history_record = Number(data.history_record);

        switch (action) {
            case 'update':
                window.api.openModalHistoryRecordRename(data.history_record);
                break;

            default:
                window.api.historyAction(data.history_record, undefined, action);
                break;
        }
        
    })
})();