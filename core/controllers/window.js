const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain
    } = require('electron')
    , path = require('path');

const state = require('../models/state');

let window;

switch (state.needConfiguration()) {
    case true:
        window = new BrowserWindow ({
            width: 1200,
            height: 600,
            webPreferences: {
                allowRunningInsecureContent: false,
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false,
                sandbox: true,
                preload: path.join(__dirname, 'config-form.js')
            },
            title: 'Cosma - configuration'
        });

        window.loadFile('template/form.html');
        break;

    case false:
        window = new BrowserWindow ({
            width: 1200,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, '../../functions/hello_world.js')
            },
            title: 'Cosma'
        });

        window.loadFile('template/home.html');
        break;
}

window.webContents.openDevTools()

// ipcMain.handle('setFullscreen', (event, flag) => {
//     if (window) {
//         window.setFullScreen(flag);
//     }
// })

ipcMain.on("askName", (event, name) => {
    console.log(name);

    let result;

    switch (name) {
        case 'Amélie':
            result = {
                prénom: "Amélie",
                nom: "Poulain",
                age: "22"
            }
            break;

        case 'Nino':
            result = {
                prénom: "Nino",
                nom: "Quinkanpoin",
                age: "23"
            }
            break;
    }

    window.webContents.send("getName", result);
});