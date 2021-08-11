const {
    contextBridge,
    ipcRenderer
} = require('electron');

const channels = {
    input: [
        'confirmConfigRegistration',
        'confirmRecordSaving',
        'getConfig',
        'confirmNewRecordTypeFromConfig'
    ],
    output: [
        'sendConfigOptions',
        'sendRecordContent',
        'askConfig',
        'askNewRecordTypeModal',
        'sendNewRecordTypeToConfig'
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