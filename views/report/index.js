const {
    BrowserWindow, // app windows generator
    ipcMain
} = require('electron')
, path = require('path');

const lang = require('../../cosma-core/models/lang');

let window;

const pageName = 'report';

module.exports = {
    open: function (report) {
        if (window !== undefined) {
            window.focus();
            return;
        }

        Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
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

        ipcMain.once("get-report", (event) => {
            event.returnValue = report;
        });
    }
}