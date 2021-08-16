const {
    contextBridge,
    ipcRenderer
} = require('electron');

const channels = {
    input: [
        'confirmConfigRegistration',
        'confirmRecordSaving',
        'getConfig',
        'confirmNewRecordTypeFromConfig',
        'getRecordTypes',
        'confirmDeleteRecordTypeFromConfig',
        'confirmUpdateRecordTypeFromConfig',
        'getRecordTypeToUpdate',
        'getFilesOriginPath',
        'getExportPath',
        'confirmExport',
        'getExportPathFromConfig',
        'getBibliographyPath',
        'getCslPath',
        'getOptionMinimumFromConfig',
        'getHistoryList',
        'confirmHistoryDelete'
    ],
    output: [
        'sendConfigOptions',
        'sendRecordContent',
        'askConfig',
        'askNewRecordTypeModal',
        'sendNewRecordTypeToConfig',
        'askRecordTypes',
        'askDeleteRecordType',
        'askUpdateRecordTypeModal',
        'askUpdateRecordType',
        'sendUpdateRecordTypeToConfig',
        'askFilesOriginPath',
        'askExportPath',
        'sendExportOptions',
        'askExportPathFromConfig',
        'askBibliographyPath',
        'askCslPath',
        'askOptionMinimumFromConfig',
        'askHistoryList',
        'sendCosmoscopeFromHistoryList',
        'sendHistoryToDelete'
    ]
}

// à refaire :
//https://www.electronjs.org/docs/tutorial/context-isolation#consid%C3%A9rations-%C3%A0-propos-de-la-s%C3%A9curit%C3%A9
// https://www.electronjs.org/docs/api/context-bridge#contextbridge
// https://www.electronjs.org/docs/tutorial/security#isolation-pour-les-contenus-non-approuv%C3%A9s

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            if (channels.output.includes(channel) === false) {
                return console.error('Invalid channel request (output)'); }

            ipcRenderer.send(channel, data);
        },
        receive: (channel, func) => {
            if (channels.input.includes(channel) === false) {
                return console.error('Invalid channel request (input)'); }

            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
);