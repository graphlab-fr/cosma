import extractCitations from './citeExtractor';
import extractParaphs from './paraphExtractor';

/**
 * @typedef Link
 * @type {object}
 * @property {string} type
 * @property {string} label
 * @property {string} target
 * @property {Set<string>} contexts
 */

/**
 *
 * @param {string} markdown
 * @param {import('../models/config').default} config
 * @returns {import('../models/record').RecordLink[]}
 */

export default function citeLinks(markdown, config) {
  const linkTypes = config.getTypesLinks();

  /** @type {Map<string, Link>} */
  const links = new Map();

  extractParaphs(markdown).forEach((paraph) => {
    extractCitations(paraph).forEach((result) => {
      result.citations.forEach((citation) => {
        if (links.has(citation.id)) {
          links.get(citation.id).contexts.add(paraph);
        } else {
          let linkType = 'undefined';
          let linkLabel;

          if (linkTypes.has(citation.type)) {
            linkType = citation.type;
            linkLabel = config.opts.link_types[linkType].label;
          }

          links.set(citation.id, {
            type: linkType,
            label: linkLabel,
            target: citation.id,
            contexts: new Set([paraph]),
          });
        }
      });
    });
  });

  return Array.from(links.values(), (link) => ({ ...link, contexts: Array.from(link.contexts) }));
}
