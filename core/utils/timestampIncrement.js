import getTimestampTuple from './timestamp';

export default function timestampIncrement(increment = 0) {
  const min = Number('24' + '60' + '60');
  const max = Number('99' + '99' + '99');

  if (increment < 0) {
    throw new Error('Increment for timestamp should positive');
  }

  const result = min + increment;

  if (result > max) {
    throw new Error('Has max timestamp increment for today');
  }

  const [year, month, day] = getTimestampTuple();
  return [year, month, day, result.toString()].join('');
}
