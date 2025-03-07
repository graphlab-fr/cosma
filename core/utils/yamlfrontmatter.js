import yml from 'yaml';

// Thanks to https://github.com/dworthen/js-yaml-front-matter/blob/master/src/index.js
const regex = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)[-|\.]{3})?([\w\W]*)*/;

/**
 * Read head of markdown files as YAML content
 * Get result as JSON
 * @param {string} fileContent
 * @param {import('yaml').ParseOptions & import('yaml').SchemaOptions} options
 * @returns {{head: unknown, body: string}} JSON
 * @throws {YAMLParseError}
 */

export default function readYamlFrontmatter(fileContent, options = {}) {
  if (fileContent === '') {
    return {
      body: null,
      head: null,
    };
  }

  const windowsCariageReturn = new RegExp(/\r\n/g);
  fileContent = fileContent.replace(windowsCariageReturn, '\n');

  const [, withDash, withoutDash, body] = regex.exec(fileContent);

  if (withoutDash === undefined) {
    return {
      body: fileContent,
      head: null,
    };
  }

  return {
    body,
    head: yml.parse(withoutDash, options),
  };
}
