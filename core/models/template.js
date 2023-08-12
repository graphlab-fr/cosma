/**
 * @file Generate the Cosmoscope's source code
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

const fs = require('fs'),
  path = require('path'),
  nunjucks = require('nunjucks'),
  mdIt = require('markdown-it')({
    html: true,
    linkify: true,
    breaks: true,
  }),
  mdItAttr = require('markdown-it-attrs');

const app = require('../package.json');

// markdown-it plugin
mdIt.use(mdItAttr, {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: [],
});

const Link = require('./link'),
  Config = require('./config'),
  Bibliography = require('./bibliography'),
  Graph = require('./graph');

const { isAnImagePath, slugify } = require('../utils/misc');
const translation = require('./lang').i;

/**
 * Class to get the Cosmoscope source code
 */

module.exports = class Template {
  static validParams = new Set(['publish', 'css_custom', 'citeproc', 'dev']);

  /**
   * Convert valid wikilinks text to Markdown hyperlinks
   * The content of the Markdown hyperlink is the link id or the linkSymbol if it is defined
   * The link is valid if it can be found from one record
   * For each link we get the type and the name from the targeted record
   * @param {object} record - File object from Graph class.
   * @param {string} linkSymbol - String from config option 'link_symbol'.
   * @return {object} - File with an updated content
   * @static
   */

  static convertLinks(record, content, linkSymbol) {
    return content.replace(Link.regexWikilink, function (match, _, type, targetId, __, text) {
      const associatedMetas = record.links.find((i) => i.target.id == targetId);

      // link is not registred into record metas
      if (associatedMetas === undefined) {
        return match;
      }

      const link = associatedMetas;

      const linkContent = text || linkSymbol || match;

      return `<a href="#${link.target.id}" title="${link.target.title}" class="record-link">${linkContent}</a>`;
    });
  }

  /**
   * Match and transform links from context
   * @param {Array} recordLinks Array of link objets
   * @param {Function} fxToHighlight Function return a boolean
   * @returns {String}
   */

  static markLinkContext(recordLinks, linkSymbol) {
    return recordLinks.map((link) => {
      if (link.context.length > 0) {
        link.context = link.context.join('\n\n');
      } else {
        link.context = '';
      }
      link.context = link.context.replace(
        Link.regexWikilink,
        (match, _, type, targetId, __, text) => {
          const matchAsNumber = targetId;
          const mark = text || linkSymbol || `&#91;&#91;${targetId}&#93;&#93;`;
          if (matchAsNumber == link.target.id) {
            return `*${mark}*{.id-context data-target-id=${matchAsNumber}}`;
          }

          return mark;
        },
      );
      return link;
    });
  }

  /**
   * Convert a path to an image to the base64 encoding of the image source
   * @param {string} imgPath
   * @returns {string|boolean} False if error
   */

  static imagePathToBase64(imgPath) {
    if (isAnImagePath(imgPath) === false) {
      return '';
    }
    const imgFileContent = fs.readFileSync(imgPath);
    const imgType = path.extname(imgPath).substring(1);
    const imgBase64 = Buffer.from(imgFileContent).toString('base64');
    return `data:image/${imgType};base64,${imgBase64}`;
  }

  /**
   * Update markdown-it image source, from a path to a base64 encoding
   * @param {string} imagesPath
   * @param {Function} state
   * @returns {String}
   * @exemple
   * ```
   * mdIt.inline.ruler2.push('image_to_base64', state => Template.mdItImageToBase64(imagesPath, state));
   * ```
   */

  static mdItImageToBase64(imagesPath, state) {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      const { type, attrs } = token;
      if (type === 'image') {
        const { src, ...rest } = Object.fromEntries(attrs);
        const imgPath = path.join(imagesPath, src);
        const imgBase64 = Template.imagePathToBase64(imgPath);
        if (imgBase64) {
          state.tokens[i].attrs = Object.entries({
            src: imgBase64,
            ...rest,
          });
        }
      }
    }
  }

  /**
   * Get data from graph and make a web app
   * @param {Graph} graph - Graph class
   * @param {string[]} params
   * @exemple
   * ```
   * const graph = new Cosmocope(records, config.opts, optionsGraph);
   * const { html } = new Template(graph, ['publish', 'citeproc']);
   * ```
   */

  constructor(graph, params = []) {
    if (!graph || graph instanceof Graph === false) {
      throw new Error('Need instance of Config to process');
    }
    this.params = new Set(params.filter((param) => Template.validParams.has(param)));
    this.config = new Config(graph.config.opts);

    if (this.config.isValid() === false) {
      throw new Error('Can not template : config invalid');
    }

    const {
      images_origin: imagesPath,
      css_custom: cssCustomPath,
      lang,
      link_symbol: linkSymbol,
      views,
      title,
      author,
      description,
      keywords,
      focus_max: focusMax,
      record_types: recordTypes,
    } = this.config.opts;
    let references;

    const filtersFromGraph = {};
    graph.getTypesFromRecords().forEach((nodes, name) => {
      nodes = Array.from(nodes);
      filtersFromGraph[name] = {
        nodes,
        active: true,
      };
    });

    /** @type {{name: string, nodes: string[]}[]} */
    const tagsFromGraph = [];
    graph.getTagsFromRecords().forEach((nodes, name) => {
      nodes = Array.from(nodes);
      tagsFromGraph.push({ name, nodes });
    });

    const tagsListAlphabetical = tagsFromGraph
      .map(({ name }) => name)
      .sort((a, b) => a.localeCompare(b));
    const tagsListIncreasing = tagsFromGraph
      .sort((a, b) => {
        if (a.nodes.length < b.nodes.length) return -1;
        if (a.nodes.length > b.nodes.length) return 1;
        return 0;
      })
      .map(({ name }) => name);

    const recordsListAlphabetical = graph.records
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(({ title }) => title);
    const recordsListChronological = graph.records
      .sort((a, b) => {
        if (a.begin < b.begin) return -1;
        if (a.begin > b.begin) return 1;
        return 0;
      })
      .map(({ title }) => title);

    if (this.params.has('citeproc')) {
      const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(this.config);
      const bibliography = new Bibliography(bib, cslStyle, xmlLocal);
      for (const record of graph.records) {
        record.replaceBibliographicText(bibliography);
      }
      references = Object.values(bibliography.library).filter(({ used }) => !!used);
    }

    const thumbnailsFromTypesRecords = Array.from(this.config.getTypesRecords())
      .filter((type) => this.config.getFormatOfTypeRecord(type) === 'image')
      .map((type) => {
        return {
          name: recordTypes[type]['fill'],
          path: path.join(imagesPath, recordTypes[type]['fill']),
        };
      });
    const thumbnailsFromRecords = graph.records
      .filter(({ thumbnail }) => typeof thumbnail === 'string')
      .map(({ thumbnail }) => {
        return {
          name: thumbnail,
          path: path.join(imagesPath, thumbnail),
        };
      });

    const templateEngine = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(path.join(__dirname, '../static')),
    );

    mdIt.inline.ruler2.push('image_to_base64', (state) =>
      Template.mdItImageToBase64(imagesPath, state),
    );

    templateEngine.addFilter('slugify', (input) => {
      return slugify(input);
    });
    templateEngine.addFilter('markdown', (input) => {
      return mdIt.render(input);
    });
    templateEngine.addFilter('timestampToLocal', (input) => {
      return new Date(input * 1000).toLocaleDateString(lang);
    });
    templateEngine.addFilter('imgPathToBase64', Template.imagePathToBase64);

    graph.records = graph.records.map((record) => {
      record.content = Template.convertLinks(record, record.content, linkSymbol || undefined);
      record.links = Template.markLinkContext(record.links, linkSymbol);
      record.backlinks = Template.markLinkContext(record.backlinks, linkSymbol);

      return record;
    });

    this.custom_css = null;
    if (this.params.has('css_custom') === true && this.config.canCssCustom() === true) {
      this.custom_css = fs.readFileSync(cssCustomPath, 'utf-8');
    }

    this.html = templateEngine.render('template/cosmoscope.njk', {
      publishMode: this.params.has('publish') === true,
      devMode: this.params.has('dev') === true,
      canSaveRecords: this.config.canSaveRecords(),

      records: graph.records.map(({ thumbnail, ...rest }) => ({
        ...rest,
        thumbnail: !!thumbnail ? path.join(imagesPath, thumbnail) : undefined,
      })),

      graph: {
        config: this.config.opts,
        data: graph.data,
        minValues: Config.minValues,
      },

      timeline: graph.getTimelineFromRecords(),

      translation: translation,
      lang: lang,

      customCss: this.custom_css,

      views: views || [],
      filters: filtersFromGraph,
      tags: tagsFromGraph,

      references,

      metadata: {
        title,
        author,
        description,
        keywords,
      },

      nodeThumbnails: [...thumbnailsFromTypesRecords, ...thumbnailsFromRecords].filter(({ path }) =>
        isAnImagePath(path),
      ),

      focusIsActive: !(focusMax <= 0),

      guiContext: Config.getContext() === 'electron' && this.params.has('publish') === false,

      faviconPath: path.join(__dirname, '../static/icons/cosmafavicon.png'),

      // stats

      nblinks: graph.data.links.length,

      date: new Date().toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),

      sorting: {
        records: graph.records.map(({ title }) => ({
          alphabetical: recordsListAlphabetical.indexOf(title),
          chronological: recordsListChronological.indexOf(title),
        })),
        tags: tagsFromGraph.map(({ name }) => ({
          alphabetical: tagsListAlphabetical.indexOf(name),
          digital: tagsListIncreasing.indexOf(name),
        })),
      },

      app: app, // app version, description, license…
    });
  }
};
