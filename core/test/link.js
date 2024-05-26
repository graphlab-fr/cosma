import assert from 'assert';
import { should } from 'chai';

import Link from '../models/link.js';

describe('Link', () => {
  describe('wikilinks from content', () => {
    const recordId = 20210907180436;
    const ids = [
      '20210613084440',
      'simpleString',
      'string with white-spaces',
      '20210619085713',
      '20210613173849',
    ];
    const typePrefix = 'a';
    const textSuffix = 'link text';
    const content = `Lorem ipsum dolor sit amet [[${ids[0]}]], consectetur adipiscing elit. Sed eleifend arcu sit amet condimentum malesuada [[${typePrefix}:${ids[1]}|${textSuffix}]].

Cras pharetra ipsum ac placerat congue [[${typePrefix}:${ids[2]}|${textSuffix}]]. Donec egestas ex at magna sollicitudin tincidunt[[${ids[3]}]]. Donec rhoncus diam facilisis ante maximus porta

Ut dapibus consectetur libero, quis tempor ligula [[${ids[4]}]] bibendum vitae. Quisque lectus lorem, vulputate [[${ids[0]}]] a molestie vitae, scelerisque eget lacus.`;

    describe('parsing with regex', () => {
      it('should parse paragraphs', () => {
        const paragraphs = content.match(Link.regexParagraph);
        paragraphs.should.have.length(3);
        paragraphs[0].startsWith(`Lorem ipsum dolor sit amet [[${ids[0]}]]`).should.be.true;
        paragraphs[0].endsWith(`malesuada [[${typePrefix}:${ids[1]}|${textSuffix}]].`).should.be
          .true;
        paragraphs[1].startsWith(`Cras pharetra ipsum ac placerat congue`).should.be.true;
        paragraphs[1].endsWith(`Donec rhoncus diam facilisis ante maximus porta`).should.be.true;
        paragraphs[2].startsWith(`Ut dapibus consectetur libero`).should.be.true;
        paragraphs[2].endsWith(`[[${ids[0]}]] a molestie vitae, scelerisque eget lacus.`).should.be
          .true;
      });

      it('should parse wikilink', () => {
        const wikilinks = content.match(Link.regexWikilink);
        wikilinks.should.be.deep.equal([
          `[[${ids[0]}]]`,
          `[[${typePrefix}:${ids[1]}|${textSuffix}]]`,
          `[[${typePrefix}:${ids[2]}|${textSuffix}]]`,
          `[[${ids[3]}]]`,
          `[[${ids[4]}]]`,
          `[[${ids[0]}]]`,
        ]);
      });

      it('should normalize wikilink', () => {
        const matches = [];
        let match;
        while ((match = Link.regexWikilink.exec(content))) {
          const { type, id, text } = match.groups;
          matches.push({ type, id, text });
        }
        matches[1].should.have.property('type').and.be.equal(typePrefix);
        matches[1].should.have.property('id').and.be.equal(ids[1].toString());
        matches[1].should.have.property('text').and.be.equal(textSuffix);
      });
    });

    const links = Link.getWikiLinksFromFileContent(recordId, content);

    it('should links have the record id as source', () => {
      for (const link of links) {
        link.should.have.property('source').and.be.equal(recordId);
      }
    });

    it('should links have the wikilink id as target', () => {
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.should.have.property('target').and.be.equal(ids[i].toLowerCase());
      }
    });

    it('should find all links from fake text', () => {
      let linksId = links.map((link) => link.target);
      linksId.should.be.deep.equal(ids.map((id) => id.toLowerCase()));
    });
  });
});
