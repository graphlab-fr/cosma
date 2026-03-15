import imagePathToBase64 from './imagePathToBase64';
import fs from 'node:fs';

jest.mock('node:fs');

const imgPath = '/path/to/image';

describe('imagePathToBase64', () => {
  test.each([
    ['jpg', [0xff, 0xd8]],
    ['png', [0x89, 0x50, 0x4e, 0x47]],
  ])('should return base64 string for "%s" image', (type, hex) => {
    const imgContent = Buffer.from(hex);

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(imgContent);
    const result = imagePathToBase64(imgPath);

    expect(result).toContain(`data:image/${type};base64`);
  });

  it('should return empty string for invalid image path', () => {
    const invalidImgPath = '/path/to/invalid.txt';

    fs.existsSync.mockReturnValue(false);

    const result = imagePathToBase64(invalidImgPath);

    expect(result).toBe('');
  });
});
