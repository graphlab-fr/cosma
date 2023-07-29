const markdown_it_container = require('markdown-it-container')
    , plugin_toc = require('eleventy-plugin-toc')
    , moment = require('moment');

const pckData = require('../package.json');

module.exports = function(e) {
    // read YAML data from 'data' folder
    e.addDataExtension("yml", contents => require("js-yaml").load(contents));

    e.addGlobalData('pck', pckData);

    e.addPlugin(plugin_toc, {
        tags: ['h2', 'h3'],
        ul: true
    });

    e.setLibrary("md",
        require("markdown-it")({
            html: true,
            breaks: true,
            linkify: true
        })
        .use(require('markdown-it-anchor'), {
                slugify: s => require('slugify')(s, {
                    remove: /[&*+~.'"!:@]/g,
                    lower: true
                })
            }
        )
        .use(require('markdown-it-deflist'))
        .use(markdown_it_container, 'important')
        .use(markdown_it_container, 'astuce')
        .use(markdown_it_container, 'note')
        .use(markdown_it_container, 'tip')
    );

    e.addFilter("fulldate", function(value, lang) {
        moment.locale(lang);
        return moment(value).format('LL');
    });

    e.addFilter("shortdate", function(value) {
        return moment(value).format("YYYY-MM-DD");
    });

    return {
        dir: {
            input: "./",
            output: "../",
            includes: "includes",
            layouts: "layouts",
            data: "data"
        }
    };
};