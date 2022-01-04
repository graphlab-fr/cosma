const {
    ipcMain,
    shell
} = require('electron');

const History = require('../models/history')
    , Display = require('../models/display')
    , Graph = require('../cosma-core/models/graph');

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
            Display.getWindow('main').webContents.loadFile(path);
            break;

        case 'open-finder':
            path = new History(recordId).pathToStore;
            shell.showItemInFolder(path);
            break;

        case 'open-report':
            report = new History(recordId).report;
            report = Graph.reportToSentences(report);
            require('../views/report').open(report);
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