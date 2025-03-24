import markdownParser from './markdownParser';
import imagePathToBase64 from './imagePathToBase64';

jest.mock('./imagePathToBase64');

describe('markdownParser', () => {
  const config = {
    opts: {
      images_origin: '/path/to/images',
    },
  };

  it('should convert image paths to base64', () => {
    const markdown = '![alt text](image.png)';
    const base64String = 'data:image/png;base64,base64encodedstring';
    imagePathToBase64.mockReturnValue(base64String);

    const result = markdownParser(markdown, config);

    expect(result).toContain(
      '<img src="data:image/png;base64,base64encodedstring" alt="alt text">',
    );
  });

  it('should not alter non-image markdown', () => {
    const markdown = '# Heading\n\nSome text';
    const result = markdownParser(markdown, config);

    expect(result).toContain('<h1>Heading</h1>');
    expect(result).toContain('<p>Some text</p>');
  });
});
