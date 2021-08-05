(function () {

    const form = document.getElementById('form-record');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        let data = new FormData(form);
        data = Object.fromEntries(data);
    
        console.log(data);
    
        window.api.send("sendRecordContent", data);
    
        window.api.receive("confirmRecordSaving", (data) => {
            console.log(data);
        });
    })
    
})();