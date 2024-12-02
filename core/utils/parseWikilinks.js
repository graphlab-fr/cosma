import extractParaphs from './paraphExtractor';
import slugify from './slugify';

/**
 * @typedef Link
 * @type {object}
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
  if (!markdown) return [];

  /**
   * @type {Map<string, Link>}
   */
  const linksDict = new Map();

  for (const match of markdown.matchAll(wikilinkRE) || []) {
    const [full, _, type, id, __, placeholder] = match;
    const target = slugify(id);

    linksDict.set(target, {
      type: type || 'undefined',
      target,
      text: config.opts['link_symbol'] || placeholder || target,
      contexts: new Set(),
    });
  }

  extractParaphs(markdown).forEach((paraph) => {
    for (const match of paraph.matchAll(wikilinkRE)) {
      const [full, _, type, id] = match;
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
