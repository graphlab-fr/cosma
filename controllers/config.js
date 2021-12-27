const {
    ipcMain,
    Menu
} = require('electron');

const Config = require('../cosma-core/models/config')
    , Display = require('../core/models/display');

ipcMain.on("get-config-options", (event) => {
    event.returnValue = Config.get();
});

ipcMain.on("get-langages", (event) => {
    event.returnValue = Config.validLangages;
});

ipcMain.on("save-config-option", (event, name, value) => {
    const newConfig = {};
    newConfig[name] = value;

    const config = new Config(newConfig);

    if (config.report.includes(name)) {
        event.returnValue = config.writeReport();
    } else {
        config.save();
        event.returnValue = true;

        let windowForSend = Display.getWindow('export');
        if (windowForSend) {
            windowForSend.webContents.send("config-change");
        }

        const appMenu = Menu.getApplicationMenu();

        appMenu.getMenuItemById('citeproc')
            .enabled = config.canCiteproc();

        appMenu.getMenuItemById('devtools')
            .visible = config.opts.devtools;
    }
});

ipcMain.on("save-config-option-typerecord", (event, name, nameInitial, color, action) => {
    let config = Config.get();

    switch (action) {
        case 'add':
            config.record_types[name] = color;

            config = new Config ({
                record_types: config.record_types
            });
            break;

        case 'update':
            delete config.record_types[nameInitial];

            config.record_types[name] = color;

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
            config = new Config ({
                record_types: Config.base.record_types
            })
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
    let config = Config.get();

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
            config = new Config ({
                link_types: Config.base.link_types
            })
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
    event.returnValue = Config.validLinkStrokes;
});

ipcMain.on("save-config-option-view", (event, name, nameInitial, key, action) => {
    let config = Config.get();

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
            config = new Config ({
                views: Config.base.views
            })
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