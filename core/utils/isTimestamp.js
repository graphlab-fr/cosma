const timestampRE = new RegExp(/^\d{14}$/);

/**
 * @param {string|number} input
 * @example
 * isTimestamp('20210901132906'); // true
 * isTimestamp(20210901132906); // true
 * isTimestamp('toto'); // false
 */

export default function isTimestamp(input) {
  let str;
  if (typeof input === 'number') {
    str = input.toString();
  } else {
    str = input;
  }

  return timestampRE.test(str);
}
