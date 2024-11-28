import extractCitations from './citeExtractor';
import extractParaphs from './paraphExtractor';

/**
 * @typedef Link
 * @type {object}
 * @property {string} type
 * @property {string} target
 * @property {Set<string>} contexts
 */

/**
 *
 * @param {string} markdown
 * @returns {import('../models/record').RecordLink[]}
 */

export default function citeLinks(markdown) {
  /** @type {Map<string, Link>} */
  const links = new Map();

  extractParaphs(markdown).forEach((paraph) => {
    extractCitations(paraph).forEach((result) => {
      result.citations.forEach((citation) => {
        if (links.has(citation.id)) {
          links.get(citation.id).contexts.add(paraph);
        } else {
          links.set(citation.id, {
            type: citation.type || 'undefined',
            target: citation.id,
            contexts: new Set([paraph]),
          });
        }
      });
    });
  });

  return Array.from(links.values(), (link) => ({ ...link, contexts: Array.from(link.contexts) }));
}
