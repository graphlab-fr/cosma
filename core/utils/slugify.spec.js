import slugify from './slugify';

describe('slugify', () => {
  it('replaces spaces with hyphens and lowercase', () => {
    expect(slugify('Hello world')).toBe('hello-world');
  });

  it('removes accents', () => {
    expect(slugify('À bientôt, François!')).toBe('a-bientot-francois');
  });

  it('removes special characters', () => {
    expect(slugify('Hello @world#123!')).toBe('hello-world123');
  });

  it('handles empty strings', () => {
    expect(slugify('')).toBe('');
  });

  it('handles strings with only spaces', () => {
    expect(slugify('    ')).toBe('');
  });

  it('keeps only letters, numbers, and hyphens', () => {
    expect(slugify('abc-!@#$%^&*()123')).toBe('abc-123');
  });

  it('handles multiple consecutive spaces', () => {
    expect(slugify('Hello    world')).toBe('hello-world');
  });

  it('handles strings with slashes', () => {
    expect(slugify('OIB / IIB / FID')).toBe('oib-iib-fid');
  });
});
