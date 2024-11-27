import fs from 'node:fs';
import path from 'node:path';

/**
 * Verif by file extension and bytes that the image is valid
 * @param {string} imagePath
 * @returns {boolean}
 * ```
 * isAnImagePath(path.join(__basename, 'image.jpg'));
 * ```
 */

export function isAnImagePath(imagePath) {
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
}
