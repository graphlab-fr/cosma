const {
        BrowserWindow, // app windows generator
        ipcMain
    } = require('electron')
    , path = require('path');

const lang = require('../../core/models/lang');

let window;

const pageName = 'history_update';

module.exports = {
    open: function (recordId) {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent: Display.getWindow('history'),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        window.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

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
    },

    build: () => require('../build-page')(pageName, __dirname)
}