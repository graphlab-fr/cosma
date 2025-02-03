import Bibliography from './bibliography';
import fs from 'node:fs';
import CSL from 'citeproc';

jest.mock('node:fs');
jest.mock('citeproc');

describe('Bibliography', () => {
  const citeItem = {
    id: 'matuschak2019',
    prefix: 'quoted by',
    label: 'page',
    'suppress-author': false,
  };

  /** @type {Bibliography} */
  let bibliography;
  const mockLibrary = {
    matuschak2019: {
      id: 'matuschak2019',
      author: [
        { family: 'Matuschak', given: 'Andy' },
        { family: 'Nielsen', given: 'Michael' },
      ],
      'citation-key': 'matuschak2019',
      issued: { 'date-parts': [[2019]] },
      language: 'en',
      title: 'How can we develop transformative tools for thought?',
      type: 'webpage',
      URL: 'https://numinous.productions/ttft/',
    },
  };
  const mockCslStyle = '<style></style>';
  const mockXmlLocal = '<locale></locale>';

  beforeEach(() => {
    bibliography = new Bibliography(mockLibrary, mockCslStyle, mockXmlLocal);
    bibliography.citeproc = {
      updateItems: jest.fn(),
      makeBibliography: jest.fn(() => [
        undefined,
        ['<div class="csl-entry">Matuschak, Andy, and Michael Nielsen. 2019.</div>'],
      ]),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotes', () => {
    it('should return formatted bibliographic records', () => {
      const items = [citeItem];
      const result = bibliography.getNotes(items);

      expect(bibliography.citeproc.updateItems).toHaveBeenCalledWith(['matuschak2019']);
      expect(result).toEqual(['Matuschak, Andy, and Michael Nielsen. 2019.']);
    });
  });

  describe('existsOnLibrary', () => {
    it('should return true if item is on library', () => {
      const result = bibliography.existsOnLibrary(citeItem);

      expect(result).toBe(true);
    });

    it('should return false if one item is not defined from library', () => {
      const result = bibliography.existsOnLibrary({
        id: 'engelbart1962',
        label: 'page',
        'suppress-author': false,
        type: 'agreesWith',
      });

      expect(result).toBe(false);
    });
  });
});
