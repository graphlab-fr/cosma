import fsPromise from 'node:fs/promises';
import path from 'node:path';

/**
 *
 * @param {*} dir
 * @returns {string[]}
 */

export default async function findMarkdownFilesRecursively(dir) {
  let results = [];

  const list = await fsPromise.readdir(dir);

  for (const file of list) {
    const filePath = path.resolve(dir, file);
    const stat = await fsPromise.stat(filePath);

    if (stat.isDirectory()) {
      // call for subdirs
      const res = await findMarkdownFilesRecursively(filePath);
      results = results.concat(res);
    } else {
      if (path.extname(file) === '.md') {
        results.push(filePath);
      }
    }
  }

  return results;
}
