const path = require('path');

const assert = require('assert'),
  should = require('chai').should();

describe('misc', () => {
  const { isAnImagePath } = require('../utils/misc');
  const { fetchFakeImages } = require('../utils/generate');

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
