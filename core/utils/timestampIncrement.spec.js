import timestampIncrement from './timestampIncrement';

jest.mock('./timestamp', () => ({
  __esModule: true,
  default: () => ['2021', '09', '01', '13', '29', '06'],
}));

describe('timestampIncrement', () => {
  it('should return max timestamp for today', () => {
    const result = timestampIncrement(0);
    expect(result).toEqual('2021' + '09' + '01' + '24' + '60' + '60');
  });

  it('should return max timestamp for today, + 1', () => {
    const result = timestampIncrement(1);
    expect(result).toEqual('2021' + '09' + '01' + '24' + '60' + '61');
  });

  it('should return max timestamp for today, + 140', () => {
    const result = timestampIncrement(140);
    expect(result).toEqual('2021' + '09' + '01' + '24' + '62' + '00');
  });

  it('should return max timestamp for today, + 753939 is max increment', () => {
    const result = timestampIncrement(753939);
    expect(result).toEqual('2021' + '09' + '01' + '99' + '99' + '99');
  });

  it('should throw error for increment + 753940', () => {
    expect(() => timestampIncrement(753940)).toThrow(Error);
  });
});
