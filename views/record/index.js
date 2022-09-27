const {
    BrowserWindow,
    dialog
} = require('electron')
, path = require('path');

const lang = require('../../core/models/lang');

let window;

const pageName = 'record';

module.exports = {
    open: function () {
        if (window !== undefined) {
            window.focus();
            return;
        }

        const Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent: Display.getWindow('main'),
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        Display.storeSpecs('record', window);

        window.loadFile(path.join(__dirname, `/dist/${lang.flag}.html`));

        window.once('ready-to-show', () => {
            window.show();
        });

        window.once('closed', () => {
            window = undefined;
        });
    },

    build: () => require('../build-page')(pageName, __dirname)
}