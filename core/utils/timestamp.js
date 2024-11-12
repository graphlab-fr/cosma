/**
 *
 * @param {Date} date
 * @returns {[string, string, string, string, string, string]}
 */

export default function getTimestampTuple(date = new Date()) {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return [year, month, day, hour, minute, second];
}
