import path from 'node:path';
import yml from 'yaml';
import { getTimestampTuple, getTimestamp, slugify } from '../utils/misc.js';
import { read } from '../utils/yamlfrontmatter.js';

export default class Record {
  /**
   * @param {string[]} files
   */

  static recordsFromFile(files) {
    const payload = new Map();

    files.forEach((file) => {
      const { content, head } = read(file);

      payload.set(head.id, new Record());
    });
  }

  /**
   *
   * @param {{
   *  id: string,
   *  title: string,
   *  content: string,
   *  types?: string[],
   *  tags?: string[],
   *  metas?: unknown,
   *  begin?: number,
   *  end?: number,
   *  thumbnail?: string,
   * }} props
   * @param {import('../models/config').default} config
   */

  constructor(
    { id, title, content, types = ['undefined'], tags = [], metas = {}, begin, end, thumbnail },
    config,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.types = types;
    this.tags = tags;
    this.metas = metas;
    this.begin = begin;
    this.end = end;
    this.thumbnail = thumbnail;

    this.config = config;

    const fileName = slugify(this.title) + '.md';
    this.path = path.join(this.config.opts.files_origin, fileName);

    this.links = [];
  }

  getYamlFrontMatter() {
    const ymlContent = yml.stringify({
      id: this.id,
      title: this.title,
      types: this.types,
      tags: this.tags.length === 0 ? undefined : this.tags,
      thumbnail: this.thumbnail,
      ...this.metas,
    });

    return ['---\n', ymlContent, '---'].join('');
  }
}
