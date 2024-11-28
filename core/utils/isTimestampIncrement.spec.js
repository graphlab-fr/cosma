import isTimestampIncrement from './isTimestampIncrement';

jest.mock('./timestamp', () => ({
  __esModule: true,
  default: () => ['2021', '09', '02', '13', '29', '06'],
}));

describe('isTimestampIncrement', () => {
  it('should return false for no timestamp string', () => {
    expect(isTimestampIncrement('toto')).toBe(false);
  });

  it('should return false for yesterday timestamp', () => {
    expect(isTimestampIncrement('2021' + '09' + '01' + '13' + '29' + '06')).toBe(false);
  });

  it('should return false for today not incremeted timestamp', () => {
    expect(isTimestampIncrement('2021' + '09' + '02' + '13' + '29' + '46')).toBe(false);
  });

  it('should return true for today incremeted timestamp', () => {
    expect(isTimestampIncrement('2021' + '09' + '02' + '24' + '60' + '65')).toBe(true);
  });
});
