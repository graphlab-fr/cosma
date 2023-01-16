const {
    app, // app event lifecycle, events
    BrowserWindow, // app this.wins generator
    ipcMain, // interface of data exchange
} = require('electron')
, path = require('path');

const lang = require('../../core/models/lang');

const pageName = 'app_preferences';

module.exports = {
    win: undefined,

    open: function () {
        if (this.win !== undefined) {
            this.win.focus();
            return;
        }

        const Display = require('../../models/display');

        this.win = new Browserthis.win(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.this.windows[pageName].title),
                parent: BrowserWindow.getFocusedWindow(),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        this.win.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        this.win.once('ready-to-show', () => {
            this.win.show();
        });

        this.win.once('closed', () => {
            this.win = undefined;
        });

        return this.win;
    },

    build: () => require('../build-page')(pageName, __dirname)
}