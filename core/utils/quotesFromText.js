import extractCitations from './citeExtractor';

/**
 * @param {string} markdown
 * @param {import('../models/bibliography').default} bibliography
 * @returns {import('./citeExtractor').CiteItem[]}
 */

export default function quotesFromText(markdown) {
  /** @type {import('./citeExtractor').CiteItem[]} */
  const citeItems = [];

  extractCitations(markdown).forEach((quote) => {
    quote.citations.forEach((citeItem) => {
      citeItems.push(citeItem);
    });
  });

  return citeItems;
}
