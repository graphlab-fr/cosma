import isTimestamp from './isTimestamp';

describe('isTimestamp', () => {
  it('should return true for 14 caracters string', () => {
    expect(isTimestamp('20210901132906')).toBe(true);
  });

  it('should return true for 14 numbers', () => {
    expect(isTimestamp(20210901132906)).toBe(true);
  });

  it('should return false for string', () => {
    expect(isTimestamp('paul otlet')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isTimestamp(2021)).toBe(false);
  });
});
