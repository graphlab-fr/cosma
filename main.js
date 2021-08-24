const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        dialog
    } = require('electron')
    , path = require('path');

const windowsModel = require('./core/models/windows');

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

    const mainWindow = new BrowserWindow(windowsModel.main);
    exports.mainWindow = mainWindow;

    process.on("uncaughtException", (err) => {
        dialog.showMessageBoxSync(mainWindow, {
            type: "error",
            title: "Erreur dans le processus",
            message: err
        })
    });

    require('./core/models/menu')(); // set app menu

    require('./core/views/cosmoscope/index')();

    /**
     * MacOS apps generally continue running even without any windows open.
     * Activating the app when no windows are available should open a new one.
     */

    app.on('activate', function () {
        if (noWindowOpen()) { require('./core/views/cosmoscope/index')(); }
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