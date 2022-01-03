const {
    ipcMain,
    BrowserWindow,
    dialog
} = require('electron');

const Record = require('../cosma-core/models/record')
    lang = require('../cosma-core/models/lang');

ipcMain.on("record-add", (event, title, type, tags) => {
    const record = new Record(title, type, tags);

    const window = BrowserWindow.getFocusedWindow();

    if (record.isValid() === false) {
        return window.webContents.send('record-backup', {
            isOk: false,
            msg: record.writeReport(),
            invalidField: record.report[0]
        });
    }

    let result = record.save();

    if (result === 'overwriting') {

        dialog.showMessageBox(window, {
            title: lang.getFor(lang.i.dialog.record_overwriting.title),
            message: lang.getWith(lang.i.dialog.record_overwriting.message, [record.fileName]),
            type: 'warning',
            buttons: [lang.getFor(lang.i.dialog.btn.cancel), lang.getFor(lang.i.dialog.btn.ok)],
            defaultId: 0,
            cancelId: 0,
            noLink: true
        }).then((response) => {
            if (response.response === 1) {
                result = record.save(true);

                window.webContents.send("record-backup", {
                    isOk: result
                });
            } else {
                window.webContents.send("record-backup", {
                    isOk: false
                });
            }
        });

    } else {
        window.webContents.send("record-backup", {
            isOk: true
        });
    }
});