import isTimestamp from './isTimestamp';
import timestampIncrement from './timestampIncrement';

/**
 * True if timestamp input is today incremented timestamp
 * @param {string} str
 */

export default function isTimestampIncrement(str) {
  if (!isTimestamp(str)) {
    return false;
  }

  const maxTimestamp = Number(timestampIncrement(0));
  const timestamp = Number(str);

  if (timestamp - maxTimestamp >= 0) {
    return true;
  }
  return false;
}
