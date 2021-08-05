const {
    contextBridge,
    ipcRenderer
} = require('electron');

const channels = {
    input: [
        'confirmConfigRegistration',
        'confirmRecordSaving'
    ],
    output: [
        'sendConfigOptions',
        'sendRecordContent'
    ]
}

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