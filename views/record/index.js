const {
    BrowserWindow,
    dialog,
    app
} = require('electron')
, path = require('path')
, fs = require('fs');

const Graph = require('../../core/models/graph')
    , lang = require('../../core/models/lang');

let window;

const pageName = 'record';

module.exports = {
    open: function () {
        const config = require('../../core/models/config').get();

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
            getFolksonomyFromUserData().then((folksonomy) => {
                const tagsList = Object.keys(folksonomy.tags);
                window.webContents.send('get-record-tags', tagsList);
                console.log('envoyé !');
            })
        });

        window.once('closed', () => {
            window = undefined;
        });
    },

    build: () => require('../build-page')(pageName, __dirname)
}

/**
 * @returns {Promise<Graph.Folksonomy>}
 */

async function getFolksonomyFromUserData() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(app.getPath('userData'), 'folks.json'), (err, data) => {
            if (err) { reject(err) }
            data = Buffer.from(data).toString('utf-8');
            data = JSON.parse(data);
            resolve(data);
        })
    })
}