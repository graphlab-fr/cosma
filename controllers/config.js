const {
    ipcMain,
    Menu,
    dialog,
    BrowserWindow
} = require('electron');

const Config = require('../core/models/config')
    , Link = require('../core/models/link')
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
    event.returnValue = ProjectConfig.validLangages;
});

ipcMain.on("save-config-option", (event, name, value) => {
    if (ProjectConfig.getOptionsList().has(name) === false) {
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

    let appMenu;

    switch (name) {
        case 'lang':
            dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                message: lang.getFor(lang.i.config.info.lang),
                type: 'info'
            });
            break;
        case 'devtools':
            appMenu = Menu.getApplicationMenu();
            appMenu.getMenuItemById('devtools').visible = config.opts.devtools;
            appMenu.getMenuItemById('new-cosmoscope-fake').visible = config.opts.devtools;
            break;
        case 'bibliography':
        case 'csl':
        case 'csl_locale':
            appMenu = Menu.getApplicationMenu();
            appMenu.getMenuItemById('citeproc').enabled = config.canCiteproc();
            break;
    }
});

ipcMain.on("save-config-option-recordsfilter", (event, meta, value, index, action) => {
    let opts = new ProjectConfig().opts, config;

    switch (action) {
        case 'add':
            config = new ProjectConfig ({
                record_filters: [
                    ...opts.record_filters,
                    { meta, value }
                ]
            });
            break;

        case 'delete':
            config = new ProjectConfig ({
                record_filters: [
                    ...opts.record_filters.filter((filter, i) => i !== index)
                ]
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new ProjectConfig ({
                    record_filters: ProjectConfig.base.record_filters
                });
            } else {
                config = new ProjectConfig();
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
    let opts = new ProjectConfig().opts, config;

    switch (action) {
        case 'add':
            opts.record_types[name] = { fill, stroke };

            config = new ProjectConfig ({
                record_types: opts.record_types
            });
            break;

        case 'update':
            delete opts.record_types[nameInitial];

            opts.record_types[name] = { fill, stroke };

            config = new ProjectConfig ({
                record_types: opts.record_types
            });
            break;

        case 'delete':
            delete opts.record_types[name];

            config = new ProjectConfig ({
                record_types: opts.record_types
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new ProjectConfig ({
                    record_types: ProjectConfig.base.record_types
                })
            } else {
                config = new ProjectConfig();
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
    let opts = new ProjectConfig().opts, config;

    switch (action) {
        case 'add':
            opts.link_types[name] = {
                stroke: stroke,
                color: color
            };

            config = new ProjectConfig ({
                link_types: opts.link_types
            });
            break;

        case 'update':
            delete opts.link_types[nameInitial];

            opts.link_types[name] = {
                stroke: stroke,
                color: color
            };

            config = new ProjectConfig ({
                link_types: opts.link_types
            });
            break;

        case 'delete':
            delete opts.link_types[name];

            config = new ProjectConfig ({
                link_types: opts.link_types
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new ProjectConfig ({
                    link_types: ProjectConfig.base.link_types
                })
            } else {
                config = new ProjectConfig();
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
    event.returnValue = Array.from(Link.validLinkStrokes)
        .map((stroke) => {
            return {id: stroke, name: lang.getFor(lang.i.windows.linktype.strokes[stroke])};
        })
});

ipcMain.on("save-config-option-view", (event, name, nameInitial, key, action) => {
    let opts = new ProjectConfig().opts, config;

    switch (action) {
        case 'add':
            opts.views[name] = key;

            config = new ProjectConfig ({
                views: opts.views
            });
            break;

        case 'update':
            delete opts.views[nameInitial];

            opts.views[name] = key;

            config = new ProjectConfig ({
                views: opts.views
            });
            break;

        case 'delete':
            delete opts.views[name];

            config = new ProjectConfig ({
                views: opts.views
            });
            break;

        case 'delete-all':
            if (askDeleteAll() === true) {
                config = new ProjectConfig ({
                    views: ProjectConfig.base.views
                })
            } else {
                config = new ProjectConfig();
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