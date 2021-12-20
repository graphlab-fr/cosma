const { ipcMain } = require('electron');

const Config = require('../cosma-core/models/config')
    , Display = require('../core/models/display');

ipcMain.on("get-config-options", (event) => {
    event.returnValue = Config.get();
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

        Display.getWindow('config').webContents.send("reset-config");
    }
});