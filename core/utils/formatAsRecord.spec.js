import formatAsRecord from './formatAsRecord';

const data = {
  id: 'otlet',
  title: 'Paul Otlet',
  type: 'type1',
  tag: 'tag1',
  begin: '1868-08-23',
  end: '1944-12-10',
  country: 'Belgique',
  field: 'Bibliographe',
};

describe('formatAsRecord', () => {
  it('should convert string types and tags to arrays', () => {
    const result = formatAsRecord(data);
    expect(result.types).toEqual(['type1']);
    expect(result.tags).toEqual(['tag1']);
  });

  it('should convert date strings to timestamps', () => {
    const result = formatAsRecord(data);
    expect(result.begin).toEqual(-3198528000);
    expect(result.end).toEqual(-790819200);
  });

  it('should use id as title if undefined', () => {
    const result = formatAsRecord({ ...data, id: undefined });
    expect(result.id).toEqual('Paul Otlet');
  });

  it('should use title as id if undefined', () => {
    const result = formatAsRecord({ ...data, title: undefined });
    expect(result.title).toEqual('otlet');
  });
});
