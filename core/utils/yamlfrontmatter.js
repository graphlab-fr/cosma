const yml = require('yaml');

// Thanks to https://github.com/dworthen/js-yaml-front-matter/blob/master/src/index.js
const regex = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;

module.exports = {
  /**
   * Read head of markdown files as YAML content
   * Get result as JSON
   * @param {string} fileContent
   * @param {object} options https://eemeli.org/yaml/#options
   * @returns {{head: object, content: string}} JSON
   */

  read: function (fileContent, options = {}) {
    const windowsCariageReturn = new RegExp(/\r\n/g);
    fileContent = fileContent.replace(windowsCariageReturn, '\n');

    const [, withDash, withoutDash, content] = regex.exec(fileContent);

    let ymlResult = {};

    if (!!fileContent) {
      ymlResult = yml.parse(withoutDash, options);
    }

    return {
      head: ymlResult,
      content,
    };
  },
};
