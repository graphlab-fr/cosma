import extractCitations from './citeExtractor';
import extractParaphs from './paraphExtractor';

/**
 *
 * @param {string} markdown
 * @returns {any[]}
 */

export default function quoteIdsWithContexts(markdown) {
  let quotes = {};

  extractParaphs(markdown).forEach((paraph) => {
    extractCitations(paraph).forEach((result) => {
      result.citations.forEach(({ id, type }) => {
        if (quotes[id]) {
          quotes[id].contexts.add(paraph);
        } else {
          quotes[id] = {
            contexts: new Set([paraph]),
            id,
            type,
          };
        }
      });
    });
  });

  return Object.values(quotes).map((quote) => ({
    ...quote,
    contexts: Array.from(quote.contexts),
  }));
}
