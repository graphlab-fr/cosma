const { BrowserWindow } = require('electron')
    , path = require('path')

const lang = require('../../cosma-core/models/lang');

let window;

const pageName = 'export';

module.exports = {
    open: function () {
        if (window !== undefined) {
            return;
        }

        const Display = require('../../models/display');

        window = new BrowserWindow(
            Object.assign(Display.getBaseSpecs('modal'), {
                title: lang.getFor(lang.i.windows[pageName].title),
                parent: Display.getWindow('main'),
                height: 220,
                webPreferences: {
                    preload: path.join(__dirname, './preload.js')
                }
            })
        );

        Display.storeSpecs('export', window);

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