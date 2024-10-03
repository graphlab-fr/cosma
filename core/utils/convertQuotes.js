import extractCitations from './citeExtractor';
import Bibliography from '../models/bibliography';

/**
 * @param {string} markdown
 * @param {Bibliography} bibliography
 */

function convertQuotes(markdown, bibliography, records, idToHighlight) {
  extractCitations(markdown).forEach((quote, index) => {
    const originalText = quote.source; // => "[@engelbart1962; quoted by @matuschak2019]"

    const idsDictionnary = new Map();

    for (const item of quote.citations) {
      if (!bibliography.library[item.id]) continue;

      // get text to replace for each quote item
      const itemText = bibliography.citeproc
        .processCitationCluster(
          {
            citationItems: [item], // => "@engelbart1962"
            properties: { noteIndex: index + 1 },
          },
          [],
          [],
        )[1][0][1] // => "(Engelbart 1962)"
        .slice(1, -1); // => "Engelbart 1962"

      idsDictionnary.set(itemText, item.id);
    }

    // get text to replace for quote (sum of items)
    let quoteText = bibliography.citeproc.processCitationCluster(
      {
        citationItems: quote.citations, // => ["@engelbart1962", "@matuschak2019"]
        properties: { noteIndex: index + 1 },
      },
      [],
      [],
    )[1][0][1]; // => "(Engelbart, 1962 ; quoted by Matuschak, Nielsen, 2019)"

    // replace each item of quote
    idsDictionnary.forEach((recordId, key) => {
      quoteText = quoteText.replace(key, () => {
        const record = records.find(({ id }) => id === recordId);

        if (!record) return key;
        return `<a href="#${record.id}" title="${record.title}" class="record-link ${record.id === idToHighlight ? 'highlight' : ''}">${key}</a>`;
      });
    });

    // "[@engelbart1962; quoted by @matuschak2019]" =>
    // (<a>Engelbart, 1962</a> ; <a>quoted by Matuschak, Nielsen, 2019</a>)
    markdown = markdown.replace(originalText, quoteText);
  });

  return markdown;
}

export default convertQuotes;
