/**
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('api',
    {
        getCurrentLang: () => 'fr',
    }
);