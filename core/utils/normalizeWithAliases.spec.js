import normalizeWithAliases from './normalizeWithAliases.js';

describe('normalizeWithAliases', () => {
  const aliasTable = {
    tag: 'tags',
    keywords: 'tags',
    keyword: 'tags',
    fullName: 'name',
    displayName: 'name',
  };

  it('should rename object keys correpond to alias', () => {
    const props = {
      keyword: 'keyword',
      displayName: 'displayName',
      keep: 'keep',
    };

    expect(normalizeWithAliases(aliasTable, props)).toEqual({
      tags: 'keyword',
      name: 'displayName',
      keep: 'keep',
    });
  });

  it('should keep only last alias from object', () => {
    const props = {
      tag: 'tag',
      keywords: 'keywords',
      keyword: 'keyword',
    };

    expect(normalizeWithAliases(aliasTable, props)).toEqual({
      tags: 'keyword',
    });
  });
});
