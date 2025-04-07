/**
 * Convert a path to an image to the base64 encoding of the image source
 * @param {string} imgPath
 * @returns {string} Empty if error
 */

import fs from 'node:fs';

export default function imagePathToBase64(imgPath) {
  if (!fs.existsSync(imgPath)) {
    return '';
  }

  const imgFileContent = fs.readFileSync(imgPath);
  const imgType = getImageType(imgFileContent);

  if (!imgType) return '';

  const imgBase64 = imgFileContent.toString('base64');
  return `data:image/${imgType};base64,${imgBase64}`;
}

/**
 * Verif by file extension and bytes that the image is valid
 * @param {Buffer} imageFile
 * @returns {'jpg'|'png'|null}
 * @see https://stackoverflow.com/a/8475542/13491646
 */

function getImageType(imageFile) {
  if (imageFile.toString('hex', 0, 2) === 'ffd8') {
    return 'jpg';
  }
  if (imageFile.toString('hex', 0, 4) === '89504e47') {
    return 'png';
  }
  return null;
}
