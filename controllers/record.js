const {
    ipcMain,
    BrowserWindow,
    dialog
} = require('electron');

const Record = require('../core/models/record')
    lang = require('../core/models/lang');

const ProjectConfig = require('../models/project-config');

ipcMain.on("record-add", (event, title, type, tags) => {
    const projectOpts = new ProjectConfig().opts;
    const record = new Record(undefined, title, type, tags, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, projectOpts);

    const window = BrowserWindow.getFocusedWindow();
    
    if (record.isValid() === false) {
        console.log(record.report);
        return window.webContents.send('record-backup', {
            isOk: false,
            msg: record.writeReport(),
            invalidField: record.report[0]
        });
    }

    record.saveAsFile()
    .then(() => {
        window.webContents.send("record-backup", {
            isOk: true
        });
    })
    .catch((err) => {
        const { type } = err;
        switch (type) {
            case 'overwriting':
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
                        result = record.saveAsFile(true)
                            .then(() => {
                                window.webContents.send("record-backup", {
                                    isOk: true
                                });
                            })
                            .catch(() => {
                                window.webContents.send("record-backup", {
                                    isOk: false
                                });
                            })
        
                    } else {
                        window.webContents.send("record-backup", {
                            isOk: false
                        });
                    }
                });
                return;
            case 'no dir':
                dialog.showMessageBox({
                    title: lang.getFor(lang.i.dialog['files_origin_unknown'].title),
                    message: lang.getFor(lang.i.dialog['files_origin_unknown'].message),
                    type: 'info',
                    buttons: ['Ok']
                });
            case 'fs error':
            case 'report':
            default:
                window.webContents.send("record-backup", {
                    isOk: false
                });
                return;
        }
    })
});