import slugify from './slugify';

describe('slugify', () => {
  it('replaces spaces with hyphens and lowercase', () => {
    expect(slugify('Hello world')).toEqual('hello-world');
  });

  it('removes accents', () => {
    expect(slugify('À bientôt, François!')).toEqual('a-bientot-francois');
  });

  it('removes special characters', () => {
    expect(slugify('Hello @world#123!')).toEqual('hello-world123');
  });

  it('handles empty strings', () => {
    expect(slugify('')).toEqual('');
  });

  it('handles strings with only spaces', () => {
    expect(slugify('    ')).toEqual('');
  });

  it('keeps only letters, numbers, and hyphens', () => {
    expect(slugify('abc-!@#$%^&*()123')).toEqual('abc-123');
  });

  it('handles multiple consecutive spaces', () => {
    expect(slugify('Hello    world')).toEqual('hello-world');
  });

  it('handles strings with slashes', () => {
    expect(slugify('OIB / IIB / FID')).toEqual('oib-iib-fid');
  });
});
