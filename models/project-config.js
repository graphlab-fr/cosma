const Config = require('../core/models/config');

const Project = require('./project');

module.exports = class ProjectConfig extends Config {
    constructor(opts) {
        if (Project.current !== undefined) {
            const { opts: currentOpts } = Project.getCurrent();
            opts = Object.assign({}, currentOpts, opts);
        }
        super(opts);
    }

    save() {
        Project.getCurrent().opts = this.opts;
    }
}