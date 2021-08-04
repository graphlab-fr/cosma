const {
    contextBridge,
    ipcRenderer
} = require('electron');

const channels = {
    input: ['getName'],
    output: ['askName']
}

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            if (channels.output.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            if (channels.input.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);