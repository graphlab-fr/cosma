import quotesFromText from './quotesFromText';

describe('quotesFromText', () => {
  it('should extract citations from markdown text', () => {
    const markdown = 'Blah blah with @doe99 and @smith2000.';

    const result = quotesFromText(markdown);

    expect(result).toEqual([
      {
        id: 'doe99',
        label: 'page',
        locator: undefined,
        prefix: undefined,
        suffix: undefined,
        'suppress-author': false,
      },
      {
        id: 'smith2000',
        label: 'page',
        locator: undefined,
        prefix: undefined,
        suffix: undefined,
        'suppress-author': false,
      },
    ]);
  });

  it('should return an empty array if no citations are found', () => {
    const markdown = 'Blah blah with no one.';

    const result = quotesFromText(markdown);

    expect(result).toEqual([]);
  });
});
