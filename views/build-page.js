const fs = require('fs')
    , path = require('path')
    , nunjucks = require('nunjucks');

const Config = require('../cosma-core/models/config')
    , lang = require('../cosma-core/models/lang');

module.exports = function (pageName, dirPath) {
    nunjucks.configure(path.join(dirPath, '/src'), { autoescape: true });

    for (const flag of Object.keys(Config.validLangages)) {
        html = nunjucks.render('index.njk', {
            lang: lang.i.windows[pageName],
            flag: flag
        });

        fs.writeFileSync(path.join(dirPath, `/dist/${flag}.html`), html);
    }
}