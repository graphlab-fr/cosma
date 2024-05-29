const fs = require('fs/promises'),
  path = require('path');

const { read: readYmlFm } = require('../utils/yamlfrontmatter');

const { expect } = require('chai');
const assert = require('assert');

describe('YAML Front Matter parser', () => {
  it('should find all properties from YAML file head', async () => {
    const fileContent = await fs.readFile(
      path.join(__dirname, './fixture', 'Paul Otlet.md'),
      'utf-8',
    );
    const { head } = readYmlFm(fileContent);

    assert.deepEqual(head, {
      title: 'Paul Otlet',
      id: 20210901132906,
      types: ['Personne', 'Chercheur'],
      subtitle: 'Fondateur du Mundaneum et juriste',
      keywords: ['CDU'],
      references: ['Otlet1930', 'Otlet1934'],
    });
  });

  it('should separate markdown content from YAML head', async () => {
    const fileContent = await fs.readFile(
      path.join(__dirname, './fixture', 'Paul Otlet.md'),
      'utf-8',
    );
    const { content } = readYmlFm(fileContent);

    expect(content).contain('\n\nPaul Otlet est la tête pensante du Mundaneum');
    expect(content).contain("personnalités et d'institutions qui l'entourent.\n");
  });

  it('should get undefined content and empty object for empty file content', () => {
    const { head, content } = readYmlFm('');

    assert.deepEqual(head, {});
    expect(content).to.be.undefined;
  });

  it('should parse with three points ending', () => {
    const id = '20220105142308';

    const fileContent = `---
id: ${id}
...

content
    `;

    const { head, content } = readYmlFm(fileContent);
    assert.deepEqual(head, { id });
    expect(content).contain('\n\ncontent');
  });
});
