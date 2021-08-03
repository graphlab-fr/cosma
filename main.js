const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        dialog, // app dialog generator
        ipcMain // event emitter
    } = require('electron')
    , path = require('path');

process.env.version = '0.3.0';

/**
 * Open a window for the app.
 */

function createWindow () {
    const window = new BrowserWindow ({
        width: 1200,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'functions/hello_world.js')
        },
        title: 'Cosma'
    });

    window.loadFile('template/home.html');
}

/**
 * Test if a window is stored into 'BrowserWindow' object.
 * @returns {boolean}
 */

function noWindowOpen () {
    if (BrowserWindow.getAllWindows().length === 0) {
        return true;
    }
    return false;
}

/**
 * Wait for 'app ready' event, before lauch the window.
 */

app.whenReady().then(() => {

    createWindow();

    /**
     * MacOS apps generally continue running even without any windows open.
     * Activating the app when no windows are available should open a new one.
     */

    app.on('activate', function () {
        if (noWindowOpen()) { createWindow(); }
    });
});

/**
 * Except on MacOs :
 * stop the app when all windows are closed.
 */

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') { // except on MacOs
        app.quit(); }
});


const state = require('./core/models/state');
console.log(state.needConfiguration());