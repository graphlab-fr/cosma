const { BrowserWindow } = require('electron')
    , path = require('path')

const lang = require('../../../cosma-core/models/lang')
    , Display = require('../../../core/models/display');

let window;

module.exports = function () {

    /**
     * Window
     * ---
     * manage displaying
     */

    if (window !== undefined) {
        return;
    }

    window = new BrowserWindow(
        Object.assign(Display.getBaseSpecs('modal'), {
            title: lang.getFor(lang.i.windows['export'].title),
            parent: Display.getWindow('main'),
            height: 230,
            webPreferences: {
                preload: path.join(__dirname, './preload.js')
            }
        })
    );

    Display.storeSpecs('export', window);

    window.webContents.openDevTools({ mode: 'detach' });

    window.loadFile(path.join(__dirname, './source.html'));

    window.once('ready-to-show', () => {
        window.show();
    });

    window.once('closed', () => {
        window = undefined;
    });
    
}