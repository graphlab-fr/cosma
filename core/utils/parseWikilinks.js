import extractParaphs from './paraphExtractor';
import slugify from './slugify';

/**
 * @typedef Link
 * @type {object}
 * @property {string} label
 * @property {string} type
 * @property {string} text
 * @property {string} target
 * @property {Set<string>} contexts
 */

const wikilinkRE = new RegExp(/\[\[((?<type>[^:|\]]+?):)?(?<id>.+?)(\|(?<text>.+?))?\]\]/, 'g');

/**
 * @param {string} markdown
 * @param {import('../models/config').default} config
 * @returns {import('../models/record').RecordLink[]}
 */

export default function parseWikilinks(markdown, config) {
  if (!markdown) {
    return [];
  }

  const linkTypes = config.getTypesLinks();

  /**
   * @type {Map<string, Link>}
   */
  const linksDict = new Map();

  for (const match of markdown.matchAll(wikilinkRE) || []) {
    const [, , type, id, , placeholder] = match;
    const target = slugify(id);

    let linkType = 'undefined';
    let linkLabel;

    if (linkTypes.has(type)) {
      linkType = type;
      linkLabel = config.opts.link_types[linkType].label;
    }

    linksDict.set(target, {
      type: linkType,
      label: linkLabel,
      target,
      text: config.opts['link_symbol'] || placeholder || target,
      contexts: new Set(),
    });
  }

  extractParaphs(markdown).forEach((paraph) => {
    for (const match of paraph.matchAll(wikilinkRE)) {
      const [, , , id] = match;
      const target = slugify(id);

      linksDict.get(target).contexts.add(paraph);
    }
  });

  const links = Array.from(linksDict.values(), (x) => ({
    ...x,
    contexts: Array.from(x.contexts),
  }));

  return links;
}
