const {
    app
} = require('electron')
, path = require('path')
, fs = require('fs');

const Graph = require('../core/models/graph');

module.exports = {
    /**
     * @returns {Promise<Graph.Folksonomy>}
     */

    getFolksonomyFromUserData: async function() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(app.getPath('userData'), 'folks.json'), (err, data) => {
                if (err) { reject(err) }
                data = Buffer.from(data).toString('utf-8');
                data = JSON.parse(data);
                resolve(data);
            })
        })
    }
}