import convertWikilinks from './convertWikilinks';

describe('convertWikilinks', () => {
  const opts = {
    link_symbol: '→',
  };
  const records = [
    {
      id: '20220403222345',
      title: 'Paul Otlet',
    },
    {
      id: 'dewey',
      title: 'Dewey',
    },
    {
      id: 'cdu',
      title: 'CDU',
    },
  ];

  it('should replace one link on text, with symbol', () => {
    const markdown = 'Lorem ipsum [[20220403222345]] dolor est.';

    expect(convertWikilinks(markdown, records, opts, records[0].id)).toEqual(
      `Lorem ipsum <a href="#20220403222345" title="Paul Otlet" class="record-link highlight">→</a> dolor est.`,
    );
  });

  it('should replace one link on text, with link text', () => {
    const markdown = 'Lorem ipsum [[20220403222345|Paul Otlet]] dolor est.';

    expect(convertWikilinks(markdown, records, opts, records[0].id)).toEqual(
      `Lorem ipsum <a href="#20220403222345" title="Paul Otlet" class="record-link highlight">Paul Otlet</a> dolor est.`,
    );
  });

  it('should replace one link on text, with link content', () => {
    const markdown = 'Lorem ipsum [[20220403222345]] dolor est.';

    expect(convertWikilinks(markdown, records, {}, records[0].id)).toEqual(
      `Lorem ipsum <a href="#20220403222345" title="Paul Otlet" class="record-link highlight">[[20220403222345]]</a> dolor est.`,
    );
  });

  it('should replace several link with capitalized text as id', () => {
    const markdown = 'Lorem ipsum [[Dewey]] dolor est [[CDU]].';

    expect(convertWikilinks(markdown, records, {}, records[0].id)).toEqual(
      `Lorem ipsum <a href="#dewey" title="Dewey" class="record-link ">Dewey</a> dolor est <a href="#cdu" title="CDU" class="record-link ">CDU</a>.`,
    );
  });

  it('should not replace link for unknown record id', () => {
    const markdown = 'Lorem ipsum [[unknown]] dolor est.';

    expect(convertWikilinks(markdown, records, {}, records[0].id)).toEqual(
      `Lorem ipsum [[unknown]] dolor est.`,
    );
  });

  it('should not add class "highlight" if not current record', () => {
    const markdown = 'Lorem ipsum [[20220403222345]] dolor est.';

    expect(convertWikilinks(markdown, records, {}, '20190403222543')).toEqual(
      `Lorem ipsum <a href="#20220403222345" title="Paul Otlet" class="record-link ">[[20220403222345]]</a> dolor est.`,
    );
  });
});
