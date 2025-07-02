import parseWikilinks from './parseWikilinks';
import Config from '../models/config';

jest.mock('../i18n.yml', () => ({}));
jest.mock('../../static/template/report.njk', () => '');

jest.mock('../i18n.yml', () => ({}));
jest.mock('../../static/template/report.njk', () => '');

const link_types = {
  a: { label: 'is about', color: 'blue', icon: 'link' },
};

const config = new Config({ link_types });
const linkSymbol = '->';
const configWithLinkSymbol = new Config({
  link_symbol: linkSymbol,
  link_types,
});

describe('parseWikilinks', () => {
  it('should return empty array if empty input', () => {
    const paraph = '';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([]);
  });

  it('should parse link id', () => {
    const paraph = 'Lorem ipsum [[20210901132906]] dolor sit amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph],
      },
    ]);
  });

  it('should parse link id and defined type', () => {
    const paraph = 'Lorem ipsum [[a:20210901132906]] dolor sit amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'a',
        label: 'is about',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph],
      },
    ]);
  });

  it('should replace undefined type', () => {
    const paraph = 'Lorem ipsum [[unknown:20210901132906]] dolor sit amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph],
      },
    ]);
  });

  it('should parse link id, type and placeholder', () => {
    const paraph = 'Lorem ipsum [[20210901132906|click here]] dolor sit amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: 'click here',
        contexts: [paraph],
      },
    ]);
  });

  it('should get placeholder from config', () => {
    const paraph = 'Lorem ipsum [[20210901132906|click here]] dolor sit amet.';

    const result = parseWikilinks(paraph, configWithLinkSymbol);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: linkSymbol,
        contexts: [paraph],
      },
    ]);
  });

  it('should parse several contexts', () => {
    const paraph1 = 'Lorem ipsum [[20210901132906]] dolor sit amet.';
    const paraph2 = 'Aenean ullamcorper sapien [[20210901132906]] quis sem fringilla.';

    const result = parseWikilinks(`${paraph1}\n\n${paraph2}`, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph1, paraph2],
      },
    ]);
  });

  it('should keep last type for link', () => {
    const paraph = 'Lorem ipsum [[a:20210901132906]] dolor sit [[20210901132906]] amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph],
      },
    ]);
  });

  it('should keep last placeholder for link', () => {
    const paraph = 'Lorem ipsum [[20210901132906|click here]] dolor sit [[20210901132906]] amet.';

    const result = parseWikilinks(paraph, config);

    expect(result).toEqual([
      {
        type: 'undefined',
        target: '20210901132906',
        text: '20210901132906',
        contexts: [paraph],
      },
    ]);
  });
});
