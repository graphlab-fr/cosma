(function () {

const form = document.getElementById('form-config');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = new FormData(form);
    data = Object.fromEntries(data);

    console.log(data);

    window.api.send("sendConfigOptions", data);

    window.api.receive("confirmConfigRegistration", (data) => {
        console.log(data);
    });
})

})();