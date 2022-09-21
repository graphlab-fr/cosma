const {
    ipcMain,
    Menu,
    dialog,
    BrowserWindow
} = require('electron');

const Config = require('../core/models/config')
    , lang = require('../core/models/lang');

const Display = require('../models/display')
    , ProjectConfig = require('../models/project-config');

ipcMain.on("get-default-config-options", (event) => {
    event.returnValue = Config.get();
});

ipcMain.on("get-config-options", (event) => {
    event.returnValue = new ProjectConfig().opts;
});

ipcMain.on("get-langages", (event) => {
    event.returnValue = Config.validLangages;
});

ipcMain.on("save-config-option", (event, name, value) => {
    if (Config.getOptionsList().has(name) === false) {
        return;
    }

    const newConfig = {};
    newConfig[name] = value;

    const config = new ProjectConfig(newConfig);

    if (config.report.includes(name)) {
        event.returnValue = config.writeReport();
        return;
    }

    config.save();
    event.returnValue = true;

    let windowForSend = Display.getWindow('export');
    if (windowForSend) {
        windowForSend.webContents.send("config-change");
    }

    if (name === 'lang') {
        dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
            message: lang.getFor(lang.i.config.info.lang),
            type: 'info'
        })
        return;
    }

    if (['devtools', 'bibliography', 'csl', 'csl_locale'].includes(name)) {
        const appMenu = Menu.getApplicationMenu();
    
        appMenu.getMenuItemById('citeproc')
            .enabled = config.canCiteproc();
    
        appMenu.getMenuItemById('devtools')
            .visible = config.opts.devtools;

        appMenu.getMenuItemById('new-cosmoscope-fake')
            .visible = config.opts.devtools;
    }
});

ipcMain.on("save-config-option-recordsfilter", (event, meta, value, index, action) => {
    let opts = new ProjectConfig().opts;

    switch (action) {
        case 'add':
            config = new Config ({
                record_filters: [
                    ...opts.record_filters,
                    { meta, value }
                ]
            });
            break;

        case 'delete':
            config = new Config ({
                record_filters: [
                    ...opts.record_filters.filter((filter, i) => i !== index)
                ]
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new Config ({
                    record_filters: Config.base.record_filters
                });
            } else {
                config = new Config();
            }
            break;
    }

    if (config.report.includes('record_filters')) {
        event.returnValue = config.writeReport();
    } else {
        config.save();
        event.returnValue = true;

        let windowForSend = Display.getWindow('config');
        if (windowForSend) {
            windowForSend.webContents.send("reset-config");
        }
    }
});

ipcMain.on("save-config-option-typerecord", (event, name, nameInitial, fill, stroke, action) => {
    let config = new ProjectConfig().opts;

    switch (action) {
        case 'add':
            config.record_types[name] = { fill, stroke };

            config = new Config ({
                record_types: config.record_types
            });
            break;

        case 'update':
            delete config.record_types[nameInitial];

            config.record_types[name] = { fill, stroke };

            config = new Config ({
                record_types: config.record_types
            });
            break;

        case 'delete':
            delete config.record_types[name];

            config = new Config ({
                record_types: config.record_types
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new Config ({
                    record_types: Config.base.record_types
                })
            } else {
                config = new Config();
            }
            break;
    }

    if (config.report.includes('record_types')) {
        event.returnValue = config.writeReport();
    } else {
        config.save();
        event.returnValue = true;

        let windowForSend = Display.getWindow('config');
        if (windowForSend) {
            windowForSend.webContents.send("reset-config");
        }
        windowForSend = Display.getWindow('record');
        if (windowForSend) {
            windowForSend.webContents.send("config-change");
        }
    }
});

ipcMain.on("save-config-option-typelink", (event, name, nameInitial, color, stroke, action) => {
    let config = new ProjectConfig().opts;

    switch (action) {
        case 'add':
            config.link_types[name] = {
                stroke: stroke,
                color: color
            };

            config = new Config ({
                link_types: config.link_types
            });
            break;

        case 'update':
            delete config.link_types[nameInitial];

            config.link_types[name] = {
                stroke: stroke,
                color: color
            };

            config = new Config ({
                link_types: config.link_types
            });
            break;

        case 'delete':
            delete config.link_types[name];

            config = new Config ({
                link_types: config.link_types
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new Config ({
                    link_types: Config.base.link_types
                })
            } else {
                config = new Config();
            }
            break;
    }

    if (config.report.includes('link_types')) {
        event.returnValue = config.writeReport();
    } else {
        config.save();
        event.returnValue = true;

        const configWindow = Display.getWindow('config');
        if (configWindow) {
            configWindow.webContents.send("reset-config");
        }
    }
});

ipcMain.on("get-link-strokes", (event) => {
    event.returnValue = Array.from(Config.validLinkStrokes)
        .map((stroke) => {
            return {id: stroke, name: lang.getFor(lang.i.windows.linktype.strokes[stroke])};
        })
});

ipcMain.on("save-config-option-view", (event, name, nameInitial, key, action) => {
    let config = new ProjectConfig().opts;

    switch (action) {
        case 'add':
            config.views[name] = key;

            config = new Config ({
                views: config.views
            });
            break;

        case 'update':
            delete config.views[nameInitial];

            config.views[name] = key;

            config = new Config ({
                views: config.views
            });
            break;

        case 'delete':
            delete config.views[name];

            config = new Config ({
                views: config.views
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new Config ({
                    views: Config.base.views
                })
            } else {
                config = new Config();
            }
            break;
    }

    if (config.report.includes('views')) {
        event.returnValue = config.writeReport();
    } else {
        config.save();
        event.returnValue = true;

        let window = Display.getWindow('config');
        if (window) {
            window.webContents.send("reset-config");
        }

        window = Display.getWindow('main');
        if (window) {
            window.webContents.send("reset-views");
        }
    }
});

/**
 * Ask user by a dialog modal to confirm delete_all
 * @returns {boolean} - True if the user answer 'Ok'
 */

function askDeleteAll () {
    const result = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), {
        message: lang.getFor(lang.i.dialog.delete_all.message),
        type: 'warning',
        buttons: [lang.getFor(lang.i.dialog.btn.cancel), lang.getFor(lang.i.dialog.btn.ok)],
        defaultId: 0,
        cancelId: 0,
        noLink: true
    })

    if (result === 1) { return true; }

    return false;
}