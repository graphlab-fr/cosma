import mdIt from 'markdown-it';
import imagePathToBase64 from './imagePathToBase64';
import path from 'node:path';

const md = new mdIt({
  html: true,
  linkify: true,
  breaks: true,
});

/**
 *
 * @param {string} markdown
 * @param {import('../models/config').default} config
 */

export default function markdownParser(markdown, config) {
  md.inline.ruler2.push('image_to_base64', (state) =>
    mdItImageToBase64(config.opts.images_origin, state),
  );

  return md.render(markdown);
}

function mdItImageToBase64(imagesPath, state) {
  for (let i = 0; i < state.tokens.length; i++) {
    const token = state.tokens[i];
    const { type, attrs } = token;
    if (type === 'image') {
      const { src, ...rest } = Object.fromEntries(attrs);
      const imgPath = path.join(imagesPath, src);
      const imgBase64 = imagePathToBase64(imgPath);
      if (imgBase64) {
        state.tokens[i].attrs = Object.entries({
          src: imgBase64,
          ...rest,
        });
      }
    }
  }
}
