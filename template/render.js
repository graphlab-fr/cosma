document.getElementById('btn')
    .addEventListener('click', () => {
        window.api.send("askName", "Amélie");

        window.api.receive("getName", (data) => {
            console.log(`Received from main process`, data);
        });
    })
