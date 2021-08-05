const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
    } = require('electron')
    , path = require('path');

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

    require('./core/view');

    /**
     * MacOS apps generally continue running even without any windows open.
     * Activating the app when no windows are available should open a new one.
     */

    app.on('activate', function () {
        if (noWindowOpen()) { require('./core/view'); }
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