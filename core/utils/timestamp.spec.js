import getTimestampTuple from './timestamp';

describe('timestamp', () => {
  it('should return [YYYY, MM, DD, hh, mm, ss] from now', () => {
    const result = getTimestampTuple();
    expect(result).toEqual([
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
      expect.any(String),
    ]);
  });

  it('should return [YYYY, MM, DD, hh, mm, ss] from date', () => {
    const result = getTimestampTuple(new Date('2020-02-03 06:14:22'));
    expect(result).toEqual(['2020', '02', '03', '06', '14', '22']);
  });
});
