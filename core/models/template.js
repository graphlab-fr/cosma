/**
 * @file Generate the Cosmoscope's source code
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright MIT License ANR HyperOtlet
 */

const path = require('path')
    , ymlFM = require('yaml-front-matter')
    , nunjucks = require('nunjucks')
    , mdIt = require('markdown-it')()
    , mdItAttr = require('markdown-it-attrs')
    , moment = require('moment');

// markdown-it plugin
mdIt.use(mdItAttr, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
});

const Config = require('./config'), 
    Graph = require('./graph');

module.exports = class Template {

    static convertLinks(file) {
        return file.content.replace(/(\[\[\s*).*?(\]\])/g, function(extract) { // get '[[***]]' strings
            // extract link id, without '[[' & ']]' caracters
            let link = extract.slice(0, -2).slice(2);
    
            link = Graph.normalizeLinks(link).target.id;
    
            if (link === NaN) { return extract; } // link is not a number
    
            const associatedMetas = file.links.find(function(i) {
                return i.target.id === link; });
    
            // link is not registred into file metas
            if (associatedMetas === undefined) { return extract; }
    
            link = associatedMetas;
    
            // return '[[***]]' string into a Markdown link with openRecord function & class
            return `[${extract}](#${link.target.id}){title="${link.target.title}" onclick=openRecord(${link.target.id}) .record-link}`;
        });
    }

    constructor (graph) {
        this.config = new Config().serializeForTemplate();

        this.types = {};
        this.tags = {};

        graph.files = graph.files.map((file) => {
            file.content = Template.convertLinks(file);

            this.registerType(file.metas.type, file.metas.id);
            this.registerTags(file.metas.tags, file.metas.id);
            
            return file;
        });

        nunjucks.configure(path.join(__dirname, '../../cosmoscope'), { autoescape: true });

        const html = nunjucks.render('template.njk', {

            publishMode: (graph.parms.includes('publish') === true),

            records: graph.files.map(function (file) {

                return {
                    id: file.metas.id,
                    title: file.metas.title,
                    type: file.metas.type,
                    tags: file.metas.tags.join(', '),
                    lastEditDate: file.metas.lastEditDate,
                    content: mdIt.render(file.content), // Markdown to HTML
                    links: file.links,
                    backlinks: file.backlinks,
                    bibliography: file.bibliography
                }
            }).sort(function (a, b) { return a.title.localeCompare(b.title); }),

            graph: {
                config: this.config.graph,
                data: JSON.stringify(graph.data)
            },

            colors: this.colors(),

            // from config

            views: this.config.views || [],

            types: Object.keys(this.types).map(function(type) {
                return { name: type, nodes: this.types[type] };
            }, this),

            tags: Object.keys(this.tags).map(function(tag) {
                return { name: tag, nodes: this.tags[tag] };
            }, this).sort(function (a, b) { return a.name.localeCompare(b.name); }),

            usedQuoteRef: graph.getUsedCitationReferences(),

            metadata: this.config.metas,

            linkSymbol: this.config.link_symbol,

            focusIsActive: !(this.config.focus_max <= 0),

            nblinks: graph.data.links.length,

            date: moment().format('YYYY-MM-DD')
        });

        return { html: html };

    }
    
    registerType (fileType, fileId) {
        // create associate object key for type if not exist
        if (this.types[fileType] === undefined) {
            this.types[fileType] = []; }
        // push the file id into associate object key
        this.types[fileType].push(fileId);
    }
    
    registerTags (fileTagList, fileId) {
        for (const tag of fileTagList) {
            // create associate object key for tag if not exist
            if (this.tags[tag] === undefined) {
                this.tags[tag] = []; }
            // push the file id into associate object key
            this.tags[tag].push(fileId);
        }
    }

    colors() {
        const replacementColor = 'grey';
        let types;
    
        const typesRecord = Object.keys(this.config.record_types)
            .map(function(key) { return {prefix: 'n_', name: key, color: this.config.record_types[key] || replacementColor}; }, this);
    
        const typesLinks = Object.keys(this.config.link_types)
            .map(function(key) { return {prefix: 'l_', name: key, color: this.config.link_types[key].color || replacementColor}; }, this);
    
        types = typesRecord.concat(typesLinks);
    
        // map the CSS syntax
    
        let colorsStyles = types
            .map(type => `.${type.prefix}${type.name} {color:var(--${type.prefix}${type.name}); fill:var(--${type.prefix}${type.name}); stroke:var(--${type.prefix}${type.name});}`, this)
    
        // add specifics parametered colors from config
        types.push({prefix: '', name: 'highlight', color: this.config.graph.highlight_color});
    
        let globalsStyles = types.map(type => `--${type.prefix}${type.name}: ${type.color};`)
    
        globalsStyles = globalsStyles.join('\n'); // array to sting…
        colorsStyles = colorsStyles.join('\n'); // …by line breaks
    
        globalsStyles = ':root {\n' + globalsStyles + '\n}';
    
        return '\n' + globalsStyles + '\n\n' + colorsStyles;
    }

}