/**
 * @file Bibliography extractor
 * @author Hendrik Erz <https://www.hendrik-erz.de/>
 * @copyright GNU GPL 3.0 Zettlr authors
 */

/**
 * Interface representing the position and details of a citation.
 * @typedef {Object} CitePosition
 * @property {number} from - The start position of this citation.
 * @property {number} to - The end position of this citation.
 * @property {string} source - The full source of this citation.
 * @property {boolean} composite - Indicates if the citation should be composite.
 * @property {CiteItem[]} citations - The list of citation items in CSL JSON style.
 */

const locatorLabels = {
  book: ['Buch', 'Bücher', 'B.', 'book', 'books', 'bk.', 'bks.', 'livre', 'livres', 'liv.'],
  chapter: ['Kapitel', 'Kap.', 'chapter', 'chapters', 'chap.', 'chaps', 'chapitre', 'chapitres'],
  column: ['Spalte', 'Spalten', 'Sp.', 'column', 'columns', 'col.', 'cols', 'colonne', 'colonnes'],
  figure: ['Abbildung', 'Abbildungen', 'Abb.', 'figure', 'figures', 'fig.', 'figs'],
  folio: ['Blatt', 'Blätter', 'Fol.', 'folio', 'folios', 'fol.', 'fols', 'fᵒ', 'fᵒˢ'],
  issue: [
    'Nummer',
    'Nummern',
    'Nr.',
    'number',
    'numbers',
    'no.',
    'nos.',
    'numéro',
    'numéros',
    'nᵒ',
    'nᵒˢ',
  ],
  line: ['Zeile', 'Zeilen', 'Z', 'line', 'lines', 'l.', 'll.', 'ligne', 'lignes'],
  note: ['Note', 'Noten', 'N.', 'note', 'notes', 'n.', 'nn.'],
  opus: ['Opus', 'Opera', 'op.', 'opus', 'opera', 'opp.'],
  page: ['Seite', 'Seiten', 'S.', 'page', 'pages', 'p.', 'pp.'],
  paragraph: [
    'Absatz',
    'Absätze',
    'Abs.',
    '¶',
    '¶¶',
    'paragraph',
    'paragraphs',
    'para.',
    'paras',
    'paragraphe',
    'paragraphes',
    'paragr.',
  ],
  part: ['Teil', 'Teile', 'part', 'parts', 'pt.', 'pts', 'partie', 'parties', 'part.'],
  section: [
    'Abschnitt',
    'Abschnitte',
    'Abschn.',
    '§',
    '§§',
    'section',
    'sections',
    'sec.',
    'secs',
    'sect.',
  ],
  'sub verbo': ['sub verbo', 'sub verbis', 's.&#160;v.', 's.&#160;vv.', 's.v.', 's.vv.'],
  verse: ['Vers', 'Verse', 'V.', 'verse', 'verses', 'v.', 'vv.', 'verset', 'versets'],
  volume: ['Band', 'Bände', 'Bd.', 'Bde.', 'volume', 'volumes', 'vol.', 'vols.'],
};

const citationRE =
  /(?:\[([^[\]]*@[^[\]]+)\])|(?<=\s|^|(-))(?:@([\p{L}\d_][^\s]*[\p{L}\d_]|\{.+\})(?: +\[(.*?)\])?)/gmu;

const fullCitationRE =
  /(?<prefix>.+)?(?:@(?<citekey>[\p{L}\d_][^\s{]*[\p{L}\d_]|\{.+\}))(?:\{(?<explicitLocator>.*)\})?(?:,\s+(?:\{(?<explicitLocatorInSuffix>.*)\})?(?<suffix>.*))?/u;

const locatorRE = /^(?:[\d, -]*\d|[ivxlcdm, -]*[ivxlcdm])/i;

function parseSuffix(suffix, containsLocator) {
  const retValue = {
    locator: undefined,
    label: 'page',
    suffix: undefined,
  };

  if (suffix === undefined) {
    return retValue;
  }

  suffix = suffix.trim();

  for (const label in locatorLabels) {
    for (const natural of locatorLabels[label]) {
      if (suffix.toLowerCase().startsWith(natural.toLowerCase())) {
        retValue.label = label;
        if (containsLocator) {
          retValue.locator = suffix.substr(natural.length).trim();
        } else {
          retValue.suffix = suffix.substr(natural.length).trim();
          const match = locatorRE.exec(retValue.suffix);
          if (match !== null) {
            retValue.locator = match[0];
            retValue.suffix = retValue.suffix.substr(match[0].length).trim();
          }
        }
        return retValue;
      }
    }
  }

  if (containsLocator) {
    retValue.locator = suffix;
  } else {
    const match = locatorRE.exec(suffix);
    if (match !== null) {
      retValue.locator = match[0];
      retValue.suffix = suffix.substr(match[0].length).trim();
    }
  }

  return retValue;
}

/**
 * @param {string} markdown
 * @returns {CitePosition[]}
 */

export default function extractCitations(markdown) {
  const retValue = [];

  for (const match of markdown.matchAll(citationRE)) {
    let from = match.index;
    let to = from + match[0].length;
    const citations = [];
    let composite = false;

    const fullCitation = match[1];
    const inTextSuppressAuthor = match[2];
    const inTextCitation = match[3];
    const optionalSuffix = match[4];

    if (inTextSuppressAuthor !== undefined) {
      from--;
    }

    if (fullCitation !== undefined) {
      for (const citationPart of fullCitation.split(';')) {
        const match = fullCitationRE.exec(citationPart.trim());
        if (match === null) {
          continue;
        }

        const thisCitation = {
          id: match.groups.citekey.replace(/{(.+)}/, '$1'),
          prefix: undefined,
          locator: undefined,
          label: 'page',
          'suppress-author': false,
          suffix: undefined,
        };

        const rawPrefix = match.groups.prefix;
        if (rawPrefix !== undefined) {
          thisCitation['suppress-author'] = rawPrefix.trim().endsWith('-');
          if (thisCitation['suppress-author']) {
            thisCitation.prefix = rawPrefix.substring(0, rawPrefix.trim().length - 1).trim();
          } else {
            thisCitation.prefix = rawPrefix.trim();
          }
        }

        const explicitLocator = match.groups.explicitLocator;
        const explicitLocatorInSuffix = match.groups.explicitLocatorInSuffix;
        const rawSuffix = match.groups.suffix;

        let suffixToParse;
        let containsLocator = true;
        if (explicitLocator === undefined && explicitLocatorInSuffix === undefined) {
          suffixToParse = rawSuffix;
          containsLocator = false;
        } else if (explicitLocatorInSuffix !== undefined || explicitLocator !== undefined) {
          suffixToParse = explicitLocator ?? explicitLocatorInSuffix;
          thisCitation.suffix = rawSuffix?.trim();
        }

        const { label, locator, suffix } = parseSuffix(suffixToParse, containsLocator);
        thisCitation.locator = locator;

        if (label !== undefined) {
          thisCitation.label = label;
        }

        if (explicitLocator === undefined && explicitLocatorInSuffix === undefined) {
          thisCitation.suffix = suffix;
        } else if (suffix !== undefined && thisCitation.locator !== undefined) {
          thisCitation.locator += suffix;
        }

        citations.push(thisCitation);
      }
    } else {
      composite = true;
      citations.push({
        prefix: undefined,
        id: inTextCitation.replace(/{(.+)}/, '$1'),
        'suppress-author': inTextSuppressAuthor !== undefined,
        ...parseSuffix(optionalSuffix, false),
      });
    }

    retValue.push({ from, to, citations, composite, source: match[0] });
  }

  return retValue;
}
