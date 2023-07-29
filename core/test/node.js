const assert = require('assert'),
  { expect } = require('chai');

const Node = require('../models/node'),
  Config = require('../models/config');

describe('Node', () => {
  const config = new Config({
    record_types: {
      undefined: { fill: 'gray', stroke: 'black' },
      toto: { fill: 'red', stroke: 'green' },
    },
  });

  describe('node style', () => {
    it('should get color, highlight and fill color', () => {
      expect(Node.getNodeStyle(config, 'toto', '')).to.deep.equal({
        fill: 'red',
        colorStroke: 'green',
        highlight: '#ff6a6a',
      });
    });

    it('should get color, highlight and fill image', () => {
      expect(Node.getNodeStyle(config, 'toto', 'tata.png')).to.deep.equal({
        fill: 'url(#tata.png)',
        colorStroke: 'green',
        highlight: '#ff6a6a',
      });
    });
  });
});
