import convertQuotes from './convertQuotes';

const mockProcessCitationCluster = jest.fn(() => [undefined, [[undefined, '(Matuschak, 2019)']]]);

const bibliography = {
  library: {
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
    engelbart1962: {
      id: 'engelbart1962',
      author: [{ family: 'Engelbart', given: 'Douglas C' }],
      'citation-key': 'engelbart1962',
      'event-place': 'Stanford',
      genre: 'SRI Summary Report',
      issued: { 'date-parts': [[1962]] },
      language: 'en',
      number: 'AFOSR-3223',
      publisher: 'Stanford Research Institute',
      'publisher-place': 'Stanford',
      title: 'Augmenting Human Intellect: A Conceptual Framework',
      'title-short': 'Augmenting Human Intellect',
      type: 'report',
      URL: 'https://www.dougengelbart.org/content/view/138/',
    },
  },
  citeproc: {
    processCitationCluster: mockProcessCitationCluster,
  },
};

const records = [
  {
    id: 'matuschak2019',
    title: 'Matuschak 2019',
  },
  {
    id: 'engelbart1962',
    title: 'Engelbart 1962',
  },
];

describe('convertQuotes', () => {
  it('should convert one link', () => {
    const text = 'Lorem @matuschak2019 ipsum dolor est.';

    const result = convertQuotes(text, bibliography, records, 'matuschak2019');

    expect(mockProcessCitationCluster).toHaveBeenCalledWith(
      {
        citationItems: [
          {
            prefix: undefined,
            id: 'matuschak2019',
            'suppress-author': false,
            locator: undefined,
            label: 'page',
            suffix: undefined,
          },
        ],
        properties: { noteIndex: 1 },
      },
      [],
      [],
    );

    expect(result).toEqual(
      'Lorem (<a href="#matuschak2019" title="Matuschak 2019" class="record-link highlight">Matuschak, 2019</a>) ipsum dolor est.',
    );
  });

  it('should convert two links', () => {
    mockProcessCitationCluster
      .mockImplementationOnce(() => [undefined, [[undefined, '(Engelbart, 1962)']]])
      .mockImplementationOnce(() => [
        undefined,
        [[undefined, '(quoted by Matuschak, Nielsen, 2019)']],
      ])
      .mockImplementationOnce(() => [
        undefined,
        [[undefined, '(Engelbart, 1962 ; quoted by Matuschak, Nielsen, 2019)']],
      ]);

    const text = 'Lorem [@engelbart1962; quoted by @matuschak2019] ipsum dolor est.';

    const result = convertQuotes(text, bibliography, records, 'matuschak2019');

    expect(mockProcessCitationCluster).toHaveBeenCalledWith(
      {
        citationItems: [
          {
            prefix: undefined,
            id: 'engelbart1962',
            'suppress-author': false,
            locator: undefined,
            label: 'page',
            suffix: undefined,
          },
        ],
        properties: { noteIndex: 1 },
      },
      [],
      [],
    );
    expect(mockProcessCitationCluster).toHaveBeenCalledWith(
      {
        citationItems: [
          {
            prefix: undefined,
            id: 'matuschak2019',
            'suppress-author': false,
            locator: undefined,
            label: 'page',
            suffix: undefined,
          },
        ],
        properties: { noteIndex: 1 },
      },
      [],
      [],
    );

    expect(result).toEqual(
      'Lorem (<a href="#engelbart1962" title="Engelbart 1962" class="record-link ">Engelbart, 1962</a> ; <a href="#matuschak2019" title="Matuschak 2019" class="record-link highlight">quoted by Matuschak, Nielsen, 2019</a>) ipsum dolor est.',
    );
  });

  it('should not add "highlight" class if unknown record', () => {
    const text = 'Lorem @matuschak2019 ipsum dolor est.';

    expect(convertQuotes(text, bibliography, records, 'unknown')).toEqual(
      'Lorem (<a href="#matuschak2019" title="Matuschak 2019" class="record-link ">Matuschak, 2019</a>) ipsum dolor est.',
    );
  });

  it('should not get anchor if no record', () => {
    const text = 'Lorem @matuschak2019 ipsum dolor est.';

    expect(convertQuotes(text, bibliography, [], 'matuschak2019')).toEqual(
      'Lorem (Matuschak, 2019) ipsum dolor est.',
    );
  });
});
