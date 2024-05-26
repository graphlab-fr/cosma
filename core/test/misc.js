import path from 'node:path';
import { isAnImagePath } from '../utils/misc.js';
import { fetchFakeImages } from '../utils/generate.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import assert from 'assert';
import { should } from 'chai';

describe('misc', () => {
  const tempFolderPath = path.join(__dirname, '../temp');

  describe('image test', () => {
    let imageName = 'valid-img.jpg';

    before(() => {
      return new Promise(async (resolve) => {
        await fetchFakeImages([imageName]);
        resolve();
      });
    });

    it('should be analysed as a valid image', async () => {
      let imagePath = path.join(tempFolderPath, imageName);
      isAnImagePath(imagePath).should.be.true;
    });

    it('should be analysed as a invalid image', async () => {
      imageName = 'wrong-img.png';
      let imagePath = path.join(tempFolderPath, imageName);
      isAnImagePath(imagePath).should.be.false;
    });
  });
});
