const assert = require('assert'),
  should = require('chai').should();

const Template = require('../models/template'),
  Cosmocope = require('../models/cosmoscope');

describe.skip('Template', () => {
  const { records } = require('../utils/fake');

  describe('link context', () => {
    const symbol = '↠';
    const graph = new Cosmocope(records);

    it('should remplace source link by symbol in the context', () => {
      let { links } = graph.records[1];
      const linksMarked = Template.markLinkContext(links, symbol);
      for (const { context, target } of linksMarked) {
        context.should.to.include(`*${symbol}*{.id-context data-target-id=${target.id}}`);
      }
    });

    it('should remplace target link by symbol in the context', () => {
      let { backlinks, id } = graph.records[2];
      const linksMarked = Template.markLinkContext(backlinks, symbol);
      for (const { context } of linksMarked) {
        context.should.to.include(`*${symbol}*{.id-context data-target-id=${id}}`);
      }
    });

    it('should remplace source link by link body in the context', () => {
      let { links } = graph.records[3];
      const linksMarked = Template.markLinkContext(links, undefined);
      for (const { context, target, type } of linksMarked) {
        if (type !== 'undefined') {
          context.should.to.include(
            `*&#91;&#91;${type}:${target.id}&#93;&#93;*{.id-context data-target-id=${target.id}}`
          );
        } else {
          context.should.to.include(
            `*&#91;&#91;${target.id}&#93;&#93;*{.id-context data-target-id=${target.id}}`
          );
        }
      }
    });

    it('should remplace source backlink by link body in the context', () => {
      let { backlinks, id } = graph.records[4];
      const linksMarked = Template.markLinkContext(backlinks, undefined);
      for (const { context, type } of linksMarked) {
        if (type !== 'undefined') {
          context.should.to.include(
            `*&#91;&#91;${type}:${id}&#93;&#93;*{.id-context data-target-id=${id}}`
          );
        } else {
          context.should.to.include(
            `*&#91;&#91;${id}&#93;&#93;*{.id-context data-target-id=${id}}`
          );
        }
      }
    });
  });
});
