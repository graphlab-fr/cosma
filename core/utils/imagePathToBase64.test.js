import imagePathToBase64 from './imagePathToBase64';
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('imagePathToBase64', () => {
  it('should return base64 string for valid image path', () => {
    const imgPath = '/path/to/image.png';
    const imgContent = 'imagecontent';
    const base64String = Buffer.from(imgContent).toString('base64');
    fs.readFileSync.mockReturnValue(imgContent);

    const result = imagePathToBase64(imgPath);

    expect(result).toBe(`data:image/png;base64,${base64String}`);
  });

  it('should return empty string for invalid image path', () => {
    const imgPath = '/path/to/invalid.txt';
    const result = imagePathToBase64(imgPath);

    expect(result).toBe('');
  });
});
