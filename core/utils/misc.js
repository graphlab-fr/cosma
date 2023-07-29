const fs = require('fs'),
  path = require('path');

module.exports = {
  /**
   * @param {string} url
   * @param {string} pathTarget
   * @returns {Promise}
   */

  downloadFile: function (url, pathTarget) {
    return new Promise((resolve, reject) => {
      const axios = require('axios');
      axios({
        url,
        responseType: 'stream',
      })
        .then(({ data }) => {
          data.pipe(fs.createWriteStream(pathTarget)).on('finish', resolve).on('error', reject);
        })
        .catch(reject);
    });
  },

  /**
   * Verif by file extension and bytes that the image is valid
   * @param {string} imagePath
   * @returns {boolean}
   * ```
   * isAnImagePath(path.join(__basename, 'image.jpg'));
   * ```
   */

  isAnImagePath: function (imagePath) {
    if (fs.existsSync(imagePath) === false) {
      return false;
    }
    const validExtnames = new Set(['.jpg', '.jpeg', '.png']);
    const imageExtname = path.extname(imagePath);
    if (validExtnames.has(imageExtname) === false) {
      return false;
    }
    const imageFileContent = fs.readFileSync(imagePath);
    // read about this genious idea https://stackoverflow.com/a/8475542/13491646
    let validHexaSchema, imageHexaSchema;
    switch (imageExtname) {
      case '.jpg':
      case '.jpeg':
        validHexaSchema = 'ffd8';
        imageHexaSchema = Buffer.from(imageFileContent, 'hex').toString('hex', 0, 2);
        break;
      case '.png':
        validHexaSchema = '89504e47';
        imageHexaSchema = Buffer.from(imageFileContent, 'hex').toString('hex', 0, 4);
        break;
    }
    if (validHexaSchema !== imageHexaSchema) {
      return false;
    }
    return true;
  },

  /**
   * Get now date or custom as string array
   * @param {Date} [date = new Date()]
   * @returns {[string, string, string, string, string, string]}
   * @example
   * ```
   * // At 2021-02-13 16:12:02
   * ['2021', '02', '13', '16', '12', '02']
   * ```
   */

  getTimestampTuple: function (date = new Date()) {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return [year, month, day, hour, minute, second];
  },
};
