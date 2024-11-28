import citeLinks from './citeLinks';

describe('citeLinks', () => {
  it('should get paragraph once as context for each cite', () => {
    const p1 =
      'Lorem ipsum, dolor sit amet [@engelbart1962 ; @smith2000] consectetur adipisicing [@engelbart1962] elit.';
    const p2 = 'Fuga praesentium consectetur [@engelbart1962] quam necessitatibus numquam!';

    const text = p1 + '\n\n' + p2;

    const result = citeLinks(text);
    expect(result).toEqual([
      {
        type: 'undefined',
        target: 'engelbart1962',
        contexts: [p1, p2],
      },
      {
        type: 'undefined',
        target: 'smith2000',
        contexts: [p1],
      },
    ]);
  });

  it('should get as link type first occurence', () => {
    const text =
      'Lorem ipsum, dolor sit amet [agreeWith: @engelbart1962] consectetur adipisicing [other: @engelbart1962] elit.';

    const result = citeLinks(text);
    expect(result).toEqual([
      {
        type: 'agreeWith',
        target: 'engelbart1962',
        contexts: [text],
      },
    ]);
  });
});
