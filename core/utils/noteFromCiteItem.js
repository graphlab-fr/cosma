/**
 * @param {import('./citeExtractor').CiteItem} citeItem
 * @param {import('../models/bibliography').default} bibliography
 */

function noteFromCiteItem(citeItem, bibliography) {
  bibliography.citeproc.updateItems(ids);
  let note = bibliography.citeproc
    .makeBibliography()[1]
    .map((t) => Bibliography.getFormatedHtmlBibliographicRecord(t));

  return note;
}
