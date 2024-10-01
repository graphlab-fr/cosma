import quotesWithContexts from './quoteIdsWithContexts';

describe('quotesWithContexts', () => {
  it('should parse one quote per paragraph', () => {
    const text = `First paragraph quoting @smith04.

Second paragraph quoting @doe99.`;

    const result = quotesWithContexts(text);

    expect(result).toEqual([
      expect.objectContaining({
        contexts: ['First paragraph quoting @smith04.'],
        id: 'smith04',
      }),
      expect.objectContaining({
        contexts: ['Second paragraph quoting @doe99.'],
        id: 'doe99',
      }),
    ]);
  });

  it('should parse many quotes per paragraph', () => {
    const text = `First paragraph quoting @smith04.

Second paragraph quoting @smith04 and @doe99. @doe99 is quoted once.`;

    const result = quotesWithContexts(text);

    expect(result).toEqual([
      expect.objectContaining({
        contexts: [
          'First paragraph quoting @smith04.',
          'Second paragraph quoting @smith04 and @doe99. @doe99 is quoted once.',
        ],
        id: 'smith04',
      }),
      expect.objectContaining({
        contexts: ['Second paragraph quoting @smith04 and @doe99. @doe99 is quoted once.'],
        id: 'doe99',
      }),
    ]);
  });
});
