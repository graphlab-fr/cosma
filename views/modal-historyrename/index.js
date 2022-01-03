const {
        app, // app event lifecycle, events
        BrowserWindow, // app windows generator
        ipcMain, // interface of data exchange
        clipboard
    } = require('electron')
    , path = require('path');

const lang = require('../../cosma-core/models/lang')
    , Display = require('../../models/display');

let window;

module.exports = function (recordId) {
    if (window !== undefined) {
        window.focus();
        return;
    }

    window = new BrowserWindow(
        Object.assign(Display.getBaseSpecs('modal'), {
            title: lang.getFor(lang.i.windows[`history_update`].title),
            parent: Display.getWindow('history'),
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );

    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });

    ipcMain.once("get-record-id", (event) => {
        event.returnValue = recordId;
    });

    return window;
}