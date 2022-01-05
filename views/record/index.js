const {
    BrowserWindow,
    dialog
} = require('electron')
, path = require('path');

const lang = require('../../cosma-core/models/lang');

let window;

const pageName = 'record';

module.exports = {
    open: function () {
        const config = require('../../cosma-core/models/config').get();

        if (config['files_origin'] === '') {
            dialog.showMessageBox({
                title: lang.getFor(lang.i.dialog['files_origin_unknown'].title),
                message: lang.getFor(lang.i.dialog['files_origin_unknown'].message),
                type: 'info',
                buttons: ['Ok']
            });

            return;
        }

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