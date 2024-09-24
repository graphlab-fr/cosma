import extractParaphs from './paraphExtractor';

const tests = [
  {
    input: 'This is a simple paragraph.',
    expected: ['This is a simple paragraph.'],
    description: 'One line',
  },
  {
    input: '',
    expected: [],
    description: 'Empty',
  },
  {
    input: `This is the first paragraph.

This is another paragraph.`,
    expected: ['This is the first paragraph.', 'This is another paragraph.'],
    description: 'Two lines',
  },
  {
    input: `This is a paragraph.

- Item 1
  - Item 2

> This is a quote.`,
    expected: [
      'This is a paragraph.',
      `- Item 1
  - Item 2`,
      '> This is a quote.',
    ],
    description: 'Contains Markdown blocks',
  },
  {
    input: 'This is a *paragraph* with **bold**, *italic* text and `code`.',
    expected: ['This is a *paragraph* with **bold**, *italic* text and `code`.'],
    description: 'One line with Mardown syntax',
  },
  {
    input: `This is a paragraph
with a forced line break.`,
    expected: [
      `This is a paragraph
with a forced line break.`,
    ],
    description: 'One line with break',
  },
  {
    input: '    This is a paragraph with indentation.',
    expected: ['    This is a paragraph with indentation.'],
    description: 'One line with indentation',
  },
  {
    input: `---
This is a paragraph`,
    expected: [
      `---
This is a paragraph`,
    ],
    description: 'One line stik to Mardown block',
  },
];

describe('extractCitations', function () {
  for (const test of tests) {
    it(test.description, () => {
      expect(extractParaphs(test.input)).toEqual(test.expected);
    });
  }
});
