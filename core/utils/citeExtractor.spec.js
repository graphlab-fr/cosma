import extractCitations from './citeExtractor';

const defaults = {
  'suppress-author': false,
  label: 'page',
  locator: undefined,
  prefix: undefined,
  suffix: undefined,
};

describe('extractCitations', function () {
  it('extracts a regular, full citation containing three IDs', () => {
    const input = 'Blah blah [@doe99; @smith2000; @smith2004].';
    const expected = [
      {
        from: 10,
        to: 42,
        composite: false,
        source: '[@doe99; @smith2000; @smith2004]',
        citations: [
          { ...defaults, id: 'doe99' },
          { ...defaults, id: 'smith2000' },
          { ...defaults, id: 'smith2004' },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with prefixes, suffixes, and locators', () => {
    const input = 'Blah blah [see @doe99, pp. 33-35 and *passim*; @smith04, chap. 1].';
    const expected = [
      {
        from: 10,
        to: 65,
        composite: false,
        source: '[see @doe99, pp. 33-35 and *passim*; @smith04, chap. 1]',
        citations: [
          {
            ...defaults,
            id: 'doe99',
            prefix: 'see',
            label: 'page',
            locator: '33-35',
            suffix: 'and *passim*',
          },
          { ...defaults, id: 'smith04', label: 'chapter', locator: '1', suffix: '' },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with an URL as citekey', () => {
    const input = '[@{https://example.com/bib?name=foobar&date=2000}, p. 33]';
    const expected = [
      {
        from: 0,
        to: 57,
        composite: false,
        source: '[@{https://example.com/bib?name=foobar&date=2000}, p. 33]',
        citations: [
          {
            ...defaults,
            id: 'https://example.com/bib?name=foobar&date=2000',
            label: 'page',
            locator: '33',
            suffix: '',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts full citation with mardown', () => {
    const input = 'With some markup [*see* @engelbart1962 p. **32**].';
    const expected = [
      {
        from: 17,
        to: 49,
        composite: false,
        source: '[*see* @engelbart1962 p. **32**]',
        citations: [
          {
            ...defaults,
            id: 'engelbart1962',
            label: 'page',
            prefix: '*see*',
            suffix: '**32**',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts citation with composite page locator and suffix', () => {
    const input = 'Citation with a suffix and locator [@engelbart1962 pp. 33, 35-37, and nowhere else].';
    const expected = [
      {
        from: 35,
        to: 83,
        composite: false,
        source: '[@engelbart1962 pp. 33, 35-37, and nowhere else]',
        citations: [
          {
            ...defaults,
            id: 'engelbart1962',
            label: 'page',
            locator: '33, 35-37',
            suffix: ', and nowhere else',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts citation with composite page locator and suffix', () => {
    const input = 'Another one [see @engelbart1962 p. 34-35].';
    const expected = [
      {
        from: 12,
        to: 41,
        composite: false,
        source: '[see @engelbart1962 p. 34-35]',
        citations: [
          {
            ...defaults,
            id: 'engelbart1962',
            label: 'page',
            prefix: 'see',
            locator: '34-35',
            suffix: '',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts citation with suffix', () => {
    const input = 'Citation with suffix only [@engelbart1962 and nowhere else].';
    const expected = [
      {
        from: 26,
        to: 59,
        composite: false,
        source: '[@engelbart1962 and nowhere else]',
        citations: [
          {
            ...defaults,
            id: 'engelbart1962',
            label: 'page',
            locator: undefined,
            suffix: 'and nowhere else',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with an explicit locator in curly braces', () => {
    const input = '[@smith{ii, A, D-Z}, with a suffix]';
    const expected = [
      {
        from: 0,
        to: 35,
        composite: false,
        source: '[@smith{ii, A, D-Z}, with a suffix]',
        citations: [
          {
            ...defaults,
            id: 'smith',
            label: 'page',
            locator: 'ii, A, D-Z',
            suffix: 'with a suffix',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with an explicit locator in the suffix', () => {
    const input = '[@smith, {pp. iv, vi-xi, (xv)-(xvii)} with suffix here]';
    const expected = [
      {
        from: 0,
        to: 55,
        composite: false,
        source: '[@smith, {pp. iv, vi-xi, (xv)-(xvii)} with suffix here]',
        citations: [
          {
            ...defaults,
            id: 'smith',
            label: 'page',
            locator: 'iv, vi-xi, (xv)-(xvii)',
            suffix: 'with suffix here',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with an empty explicit locator to prevent suffix parsing', () => {
    const input = '[@smith{}, 99 years later]';
    const expected = [
      {
        from: 0,
        to: 26,
        composite: false,
        source: '[@smith{}, 99 years later]',
        citations: [
          { ...defaults, id: 'smith', label: 'page', suffix: '99 years later', locator: '' },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular, full citation with author suppression', () => {
    const input = 'Smith says blah [-@smith04].';
    const expected = [
      {
        from: 16,
        to: 27,
        composite: false,
        source: '[-@smith04]',
        citations: [{ ...defaults, id: 'smith04', 'suppress-author': true, prefix: '' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with author suppression', () => {
    const input = 'One other citation where Smith says -@smith04';
    const expected = [
      {
        from: 36,
        to: 45,
        composite: true,
        source: '@smith04',
        citations: [{ ...defaults, id: 'smith04', 'suppress-author': true }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation', () => {
    const input = '@smith04 and @doe99 says blah.';
    const expected = [
      {
        from: 0,
        to: 8,
        composite: true,
        source: '@smith04',
        citations: [{ ...defaults, id: 'smith04' }],
      },
      {
        from: 13,
        to: 19,
        composite: true,
        source: '@doe99',
        citations: [{ ...defaults, id: 'doe99' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with optional locator/suffix', () => {
    const input = '@smith04 [p. 33] says blah.';
    const expected = [
      {
        from: 0,
        to: 16,
        composite: true,
        source: '@smith04 [p. 33]',
        citations: [{ ...defaults, id: 'smith04', label: 'page', locator: '33', suffix: '' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with a URL as citekey', () => {
    const input = '@{https://example.com/bib?name=foobar&date=2000} says blah.';
    const expected = [
      {
        from: 0,
        to: 48,
        composite: true,
        source: '@{https://example.com/bib?name=foobar&date=2000}',
        citations: [{ ...defaults, id: 'https://example.com/bib?name=foobar&date=2000' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with a URL as citekey and optional locator/suffix', () => {
    const input = '@{https://example.com/bib?name=foobar&date=2000} [p. 33] says blah.';
    const expected = [
      {
        from: 0,
        to: 56,
        composite: true,
        source: '@{https://example.com/bib?name=foobar&date=2000} [p. 33]',
        citations: [
          {
            ...defaults,
            id: 'https://example.com/bib?name=foobar&date=2000',
            label: 'page',
            locator: '33',
            suffix: '',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts regular citation with type', () => {
    const input = 'Blah blah [agreesWith: @doe99; about: @smith2000].';
    const expected = [
      {
        from: 10,
        to: 49,
        composite: false,
        source: '[agreesWith: @doe99; about: @smith2000]',
        citations: [
          { ...defaults, id: 'doe99', type: 'agreesWith' },
          { ...defaults, id: 'smith2000', type: 'about' },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with a URL as citekey and locator without explicit label', () => {
    const input = '@{https://example.com/bib?name=foobar&date=2000} [33] says blah.';
    const expected = [
      {
        from: 0,
        to: 53,
        composite: true,
        source: '@{https://example.com/bib?name=foobar&date=2000} [33]',
        citations: [
          {
            ...defaults,
            id: 'https://example.com/bib?name=foobar&date=2000',
            label: 'page',
            locator: '33',
            suffix: '',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts an in-text citation with a regular citekey and locator without explicit label', () => {
    const input = '@Author2015 [33] says blah.';
    const expected = [
      {
        from: 0,
        to: 16,
        composite: true,
        source: '@Author2015 [33]',
        citations: [{ ...defaults, id: 'Author2015', label: 'page', locator: '33', suffix: '' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular citation with a regular citekey and locator without explicit label', () => {
    const input = 'Someone [@Author2015, 33] says blah.';
    const expected = [
      {
        from: 8,
        to: 25,
        composite: false,
        source: '[@Author2015, 33]',
        citations: [{ ...defaults, id: 'Author2015', label: 'page', locator: '33', suffix: '' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a regular citation with locator without explicit label and a suffix', () => {
    const input = 'Someone [@Author2015, 33 and someplace else] says blah.';
    const expected = [
      {
        from: 8,
        to: 44,
        composite: false,
        source: '[@Author2015, 33 and someplace else]',
        citations: [
          {
            ...defaults,
            id: 'Author2015',
            label: 'page',
            locator: '33',
            suffix: 'and someplace else',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('extracts a citations and locators with latin numbers and a suffix', () => {
    const input = 'Someone [@Author2015, ix-xi and someplace else] says blah.';
    const expected = [
      {
        from: 8,
        to: 47,
        composite: false,
        source: '[@Author2015, ix-xi and someplace else]',
        citations: [
          {
            ...defaults,
            id: 'Author2015',
            label: 'page',
            locator: 'ix-xi',
            suffix: 'and someplace else',
          },
        ],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('tests for an edge case of a barebones citation, followed by a newline and a bracket-citation', () => {
    const input = '@GrewalNetworkPower2009\n[@gallowayProtocolHowControl2004]';
    const expected = [
      {
        citations: [
          {
            id: 'GrewalNetworkPower2009',
            label: 'page',
            locator: undefined,
            prefix: undefined,
            suffix: undefined,
            'suppress-author': false,
          },
        ],
        composite: true,
        from: 0,
        to: 23,
        source: '@GrewalNetworkPower2009',
      },
      {
        citations: [
          {
            id: 'gallowayProtocolHowControl2004',
            label: 'page',
            locator: undefined,
            prefix: undefined,
            suffix: undefined,
            'suppress-author': false,
          },
        ],
        composite: false,
        from: 24,
        source: '[@gallowayProtocolHowControl2004]',
        to: 57,
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });

  it('ignore quote begin by \\', () => {
    const input = '\\@smith04 and @doe99 says blah.';
    const expected = [
      {
        from: 14,
        to: 20,
        composite: true,
        source: '@doe99',
        citations: [{ ...defaults, id: 'doe99' }],
      },
    ];
    expect(extractCitations(input)).toEqual(expected);
  });
});
