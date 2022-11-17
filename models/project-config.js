const { app } = require('electron')
    , path = require('path')
    , fs = require('fs');

const Config = require('../core/models/config');

const Project = require('./project');

module.exports = class ProjectConfig extends Config {
    static getDefaultConfigFilePath() {
        const configFileInElectronUserDataDir = path.join(app.getPath('userData'), 'default-options.json');
        return configFileInElectronUserDataDir;
    }

    static init() {
        if (fs.existsSync(ProjectConfig.getDefaultConfigFilePath()) === false) {
            new Config({}, ProjectConfig.getDefaultConfigFilePath()).save();
        }
    }

    constructor(opts = {}) {
        if (Project.current !== undefined) {
            const { opts: currentOpts } = Project.getCurrent();
            opts = Object.assign({}, currentOpts, opts);
        }
        super(opts, ProjectConfig.getDefaultConfigFilePath());
    }

    save() {
        Project.getCurrent().opts = this.opts;
    }
}