import { read } from './yamlfrontmatter';

const tests = [
  {
    input: `---
id: 20210901132906
---

Paul Otlet est la tête pensante du Mundaneum`,
    expected: {
      content: `

Paul Otlet est la tête pensante du Mundaneum`,
      head: {
        id: 20210901132906,
      },
    },
    description: 'With "---" separator',
  },
  {
    input: `---
id: 20210901132906
...

Paul Otlet est la tête pensante du Mundaneum`,
    expected: {
      content: `

Paul Otlet est la tête pensante du Mundaneum`,
      head: {
        id: 20210901132906,
      },
    },
    description: 'With "..." separator',
  },
  {
    input: '',
    expected: {
      content: undefined,
      head: {},
    },
    description: 'Empty',
  },
];

describe('YAML Front Matter parser', function () {
  for (const test of tests) {
    it(test.description, () => {
      expect(read(test.input)).toEqual(test.expected);
    });
  }
});
