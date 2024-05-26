/**
 * @file Generate the Cosmoscope's source code
 * @author Guillaume Brioudes <https://myllaume.fr/>
 * @copyright GNU GPL 3.0 Cosma's authors
 */

import fs from 'node:fs';
import path from 'node:path';
import Graph from './graph.js';
import Config from './config.js';
import Link from './link.js';
import Bibliography from './bibliography.js';
import nunjucks from 'nunjucks';
import mdIt from 'markdown-it';
import * as Citr from '@zettlr/citr';
import app from '../../package.json';
import { isAnImagePath, slugify } from '../utils/misc.js';
import langPck from './lang.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const md = new mdIt({
  html: true,
  linkify: true,
  breaks: true,
});

/**
 * Class to get the Cosmoscope source code
 */

class Template {
  static validParams = new Set(['publish', 'css_custom', 'citeproc', 'dev']);

  /**
   * Match and transform links from context
   * @param {Array} recordLinks Array of link objets
   * @param {Function} fxToHighlight Function return a boolean
   * @returns {String}
   */

  static markLinkContext(recordLinks) {
    return recordLinks.map((link) => {
      if (link.context.length > 0) {
        link.context = link.context.join('\n\n');
      } else {
        link.context = '';
      }
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
   * md.inline.ruler2.push('image_to_base64', state => Template.mdItImageToBase64(imagesPath, state));
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
      hide_id_from_record_header: hideIdFromRecordHeader,
    } = this.config.opts;

    /** @type {string[]} */
    const references = [];
    /** @type {Bibliography} */
    let bibliography;

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

    if (this.params.has('citeproc') && this.config.canCiteproc()) {
      const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(this.config);
      bibliography = new Bibliography(bib, cslStyle, xmlLocal);
      for (const record of graph.records) {
        record.setBibliography(bibliography);
        record.links.forEach(({ target }) => {
          if (bibliography.library[target.id]) {
            references.push(bibliography.library[target.id]);
          }
        });
      }
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

    md.inline.ruler2.push('image_to_base64', (state) =>
      Template.mdItImageToBase64(imagesPath, state),
    );

    templateEngine.addFilter('slugify', (input) => {
      return slugify(input);
    });
    templateEngine.addFilter('convertLinks', (input, opts, idToHighlight) => {
      // Replace wikilinks: "[[g:1234567890|toto]]" to "<a>toto</a>"
      input = input.replace(Link.regexWikilink, (match, _, type, targetId, __, text) => {
        const record = graph.records.find(({ id }) => id === targetId.toLowerCase());

        if (!record) return match;

        const isNumbers = !isNaN(Number(targetId));

        let linkContent;
        if (text) {
          linkContent = text;
        } else if (opts['link_symbol']) {
          linkContent = opts['link_symbol'];
        } else {
          linkContent = isNumbers ? match : targetId;
        }

        return `<a href="#${record.id}" title="${escapeQuotes(record.title)}" class="record-link ${
          record.id === idToHighlight ? 'highlight' : ''
        }">${linkContent}</a>`.trim();
      });

      if (bibliography) {
        Citr.util.extractCitations(input).forEach((quoteText, index) => {
          let citationItems;
          try {
            citationItems = Citr.parseSingle(quoteText);
          } catch (error) {
            citationItems = [];
          }

          /**
           * @type {Map<string, string>}
           * Dictionnary contains record id for each cluster
           * @example
           * ```
           * "[@Fowler_2003, 2]"
           * { 'Fowler 2003' => 'Fowler_2003' }
           * ```
           */
          const idsDictionnary = new Map();
          for (const item of citationItems) {
            const { id } = item;
            if (!bibliography.library[id]) continue;

            const idAsTextQuote = bibliography.citeproc
              // get "(Fowler 2003)"
              .processCitationCluster(
                {
                  citationItems: [item],
                  properties: { noteIndex: index + 1 },
                },
                [],
                [],
              )[1][0][1]
              // get "Fowler 2003"
              .slice(1, -1);

            idsDictionnary.set(idAsTextQuote, item.id);
          }

          /**
           * Quoting marks to render on text
           * @example
           * ```
           * "[@Fowler_2003, 2]" => "(Fowler 2003, p.2)"
           * ```
           */
          let cluster = bibliography.get({
            quotesExtract: {
              citationItems,
              properties: { noteIndex: index + 1 },
            },
            text: quoteText,
            ids: new Set(citationItems.map(({ id }) => id)),
          }).cluster;

          // Replace "(Fowler 2003, p.2)" to "(<a>Fowler 2003</a>, p.2)"
          idsDictionnary.forEach((recordId, key) => {
            cluster = cluster.replace(key, () => {
              const record = graph.records.find(({ id }) => id === recordId);
              if (!record) return key;
              return `<a href="#${record.id}" title="${escapeQuotes(
                record.title,
              )}" class="record-link ${
                record.id === idToHighlight ? 'highlight' : ''
              }">${key}</a>`.trim();
            });
          });

          if (cluster) {
            input = input.replace(quoteText, cluster);
          }
        });
      }

      return input;
    });
    templateEngine.addFilter('markdown', (input) => {
      return md.render(input);
    });
    templateEngine.addFilter('timestampToLocal', (input) => {
      return new Date(input * 1000).toLocaleDateString(lang);
    });
    templateEngine.addFilter('imgPathToBase64', Template.imagePathToBase64);

    graph.records = graph.records.map((record) => {
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

      hideIdFromRecordHeader,
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

      translation: langPck.i,
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
}

function escapeQuotes(text) {
  return text.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

export default Template;
