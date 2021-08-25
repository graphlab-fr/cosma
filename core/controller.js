const {
    contextBridge,
    ipcRenderer
} = require('electron');

/**
 * Valid channels name to secure the API bridge, control the data calls
 */

const channels = {
    input: [

        /**
         * Configuration
         */

        'confirmConfigRegistration',         // config/index.js → config/main-render.js
        'getConfig',                         // config/index.js → config/main-render.js
        'getFilesOriginPath',                // config/index.js → config/main-render.js
        'confirmNewRecordTypeFromConfig',    // config/index.js → config/main-render.js
                                             //                 ↘ config/modal-addrecordtype-render.js
        'confirmUpdateRecordTypeFromConfig', // config/index.js → config/main-render.js
                                             //                 ↘ config/modal-updaterecordtype-render.js
        'confirmDeleteRecordTypeFromConfig', // config/index.js → config/main-render.js
        'confirmNewLinkTypeFromConfig',      // config/index.js → config/main-render.js
                                             //                 ↘ config/modal-addlinktype-render.js
        'getRecordTypeToUpdate',             // config/index.js → config/modal-updaterecordtype-render.js
        'getLinkTypeToUpdate',               // config/index.js → config/modal-updatelinktype-render.js
        'confirmUpdateLinkTypeFromConfig',   // config/index.js → config/main-render.js
                                             //                 ↘ config/modal-updatelinktype-render.js
        'confirmDeleteLinkTypeFromConfig',   // config/index.js → config/main-render.js
        'getBibliographyPath',               // config/index.js → config/main-render.js
        'getCslPath',                        // config/index.js → config/main-render.js
        'getLocalesPath',                    // config/index.js → config/main-render.js
        'getCustomCssPath',                  // config/index.js → config/main-render.js
        'getOptionMinimumFromConfig',        // config/index.js → config/main-render.js
        'getLinkStokes',                     // config/index.js → config/modal-addlinktype-render.js

        /**
         * Record
         */

        'getRecordTypes', // record/index.js → record/main-render.js

        /**
         * Export
         */

        'getExportPath',           // export/index.js → export/main-render.js
        'getExportOptions',        // export/index.js → export/main-render.js
        'confirmExport',           // export/index.js → export/main-render.js
        'getExportPathFromConfig', // export/index.js → export/main-render.js

        /**
         * Record
         */

        'confirmRecordSaving',  // record/index.js → record/main-render.js

        /**
         * History
         */

        'getHistoryList',          // history/index.js → history/main-render.js
        'confirmRenameHistory',    // history/index.js → history/main-render.js
        'confirmHistoryDelete',    // history/index.js → history/main-render.js
        'confirmHistoryDeleteAll', // history/index.js → history/main-render.js
        'getMetasHistory',         // history/index.js → history/modal-rename-render.js
        'getHistoryReport',        // history/index.js → history/modal-report-render.js

        /**
         * Cosmoscope
         */

        'confirmViewRegistration', // cosmoscope/index.js → cosmoscope/main-preload.js
                                   //                     ↘ cosmoscope/modal-view-render.js
        'getNewViewKey'            // cosmoscope/index.js → cosmoscope/modal-view-render.js
    ],
    output: [

        /**
         * Configuration
         */

        'sendConfigOptions',            // config/index.js ← config/main-render.js
        'askConfig',                    // config/index.js ← config/main-render.js
        'askBibliographyPath',          // config/index.js ← config/main-render.js
        'askCslPath',                   // config/index.js ← config/main-render.js
        'askLocalesPath',               // config/index.js ← config/main-render.js
        'askCustomCssPath',             // config/index.js ← config/main-render.js
        'askOptionMinimumFromConfig',   // config/index.js ← config/main-render.js
        'askFilesOriginPath',           // config/index.js ← config/main-render.js
        'askNewRecordTypeModal',        // config/index.js ← config/main-render.js
        'askNewLinkTypeModal',          // config/index.js ← config/main-render.js
        'askDeleteRecordType',          // config/index.js ← config/main-render.js
        'askUpdateRecordTypeModal',     // config/index.js ← config/main-render.js
        'sendNewRecordTypeToConfig',    // config/index.js ← config/modal-addrecordtype-render.js
        'sendUpdateRecordTypeToConfig', // config/index.js ← config/modal-updaterecordtype-render.js
        'askLinkStokes',                // config/index.js ← config/modal-addlinktype-render.js
                                        //                 ↖ config/modal-updatelinktype-render.js
        'askUpdateLinkTypeModal',       // config/index.js ← config/modal-updatelinktype-render.js
        'sendUpdateLinkTypeToConfig',   // config/index.js ← config/modal-updatelinktype-render.js
        'askDeleteLinkType',            // config/index.js ← config/main-render.js
        'sendNewLinkTypeToConfig',      // config/index.js ← config/modal-addlinktype-render.js

        /**
         * Record
         */

        'sendRecordContent', // record/index.js ← record/main-render.js
        'askRecordTypes',    // record/index.js ← record/main-render.js

        /**
         * Export
         */
        
        'askExportPath',           // export/index.js ← export/main-render.js
        'askExportOptions',        // export/index.js ← export/main-render.js
        'sendExportOptions',       // export/index.js ← export/main-render.js
        'askExportPathFromConfig', // export/index.js ← export/main-render.js

        /**
         * History
         */
        
        'askHistoryList',                 // history/index.js ← history/main-render.js
        'sendCosmoscopeFromHistoryList',  // history/index.js ← history/main-render.js
        'sendHistoryToDelete',            // history/index.js ← history/main-render.js
        'askHistoryDeleteAll',            // history/index.js ← history/main-render.js
        'askRenameHistoryModal',          // history/index.js ← history/main-render.js
        'askHistoryReportModal',          // history/index.js ← history/main-render.js
        'askCosmoscopeExportFromHistory', // history/index.js ← history/main-render.js
        'sendNewHistoryName',             // history/index.js ← history/modal-rename-render.js

        /**
         * Cosmoscope
         */

        'sendViewName' // cosmoscope/index.js ← cosmoscope/modal-view-render.js
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
        },
        receiveOnce: (channel, func) => {
            if (channels.input.includes(channel) === false) {
                return console.error('Invalid channel request (input)'); }

            ipcRenderer.once(channel, (event, ...args) => func(...args));
        }
    }
);