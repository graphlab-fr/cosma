const {
    ipcMain,
    shell
} = require('electron');

const History = require('../models/history')
    , Display = require('../models/display')
    , Graph = require('../cosma-core/models/graph');

const config = require('../cosma-core/models/config').get();

ipcMain.on("get-history-records", (event) => {
    event.returnValue = History.get().records;
});

ipcMain.on("history-action", (event, recordId, description, action) => {
    let result = true, path, record, report;

    switch (action) {
        case 'update':
            record = new History()
            record.data.records[recordId].description = description;
            result = record.save();
            break;

        case 'open-cosmoscope':
            path = new History(recordId).pathToStore;
            let mainWindow = Display.getWindow('main');

            if (mainWindow === undefined) {
                require('../views/cosmoscope').open();
                mainWindow = Display.getWindow('main');
            }

            mainWindow.webContents.loadFile(path);
            break;

        case 'open-finder':
            path = new History(recordId).pathToStore;
            shell.showItemInFolder(path);
            break;

        case 'open-report':
            record = new History(recordId);

            report = record.getReport();
            report = Graph.reportToSentences(report);

            const moment = require('moment');
            moment.locale(config.lang);

            require('../views/report').open(report, moment(record.date).format('LLLL'));
            break;

        case 'delete':
            result = new History(recordId).delete();
            break;

        case 'delete-all':
            new History().deleteAll();
            break;
    }

    event.returnValue = result;

    if (result === false) { return; }

    window = Display.getWindow('history');
    if (window) {
        window.webContents.send("reset-history");
    }
});