/**
 *
 * @param {string[]} types
 * @param {import('../models/config')} config
 * @returns
 */

export default function unknownTypesMessage(types, config) {
  const unknownTypes = types.filter((type) => !config.hasRecordType(type));

  if (unknownTypes.length === 0) {
    return undefined;
  }

  let message;
  if (unknownTypes.length === 1) {
    message = `Type "${unknownTypes[0]}" is unknown.`;
  } else {
    message = `Types "${unknownTypes.join('","')}" are unknown.`;
  }
  return message;
}
