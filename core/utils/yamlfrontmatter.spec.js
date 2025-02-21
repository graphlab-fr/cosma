import { YAMLParseError } from 'yaml';
import readYamlFrontmatter from './yamlfrontmatter';

describe('YAML Front Matter parser', function () {
  it('With "---" separator', () => {
    const input = `---
id: 20210901132906
---

Paul Otlet est la tête pensante du Mundaneum`;

    expect(readYamlFrontmatter(input)).toEqual({
      body: `

Paul Otlet est la tête pensante du Mundaneum`,
      head: {
        id: 20210901132906,
      },
    });
  });

  it('With "..." separator', () => {
    const input = `---
id: 20210901132906
...

Paul Otlet est la tête pensante du Mundaneum`;

    expect(readYamlFrontmatter(input)).toEqual({
      body: `

Paul Otlet est la tête pensante du Mundaneum`,
      head: {
        id: 20210901132906,
      },
    });
  });

  it('Catch YAML parse error', () => {
    const input = `---
id: 20210901132906
id: 20210901132906
...

Paul Otlet est la tête pensante du Mundaneum`;

    expect(() => readYamlFrontmatter(input)).toThrow(YAMLParseError);
  });

  it('Empty', () => {
    const input = '';

    expect(readYamlFrontmatter(input)).toEqual({
      body: null,
      head: null,
    });
  });

  it('No head', () => {
    const input = 'No Yaml Front Matter';

    expect(readYamlFrontmatter(input)).toEqual({
      body: 'No Yaml Front Matter',
      head: null,
    });
  });
});
