import getGraph from './getGraph';
import Record from '../models/record';
import Config from '../models/config';

jest.mock('../i18n.yml', () => ({}));
jest.mock('../../static/template/report.njk', () => '');

const opts = {
  record_types: {
    undefined: { fill: '#858585', stroke: '#858585' },
    people: { fill: '#858585', stroke: '#858585' },
  },
  link_types: {
    undefined: { stroke: 'simple', color: '#e1e1e1' },
    collab: { stroke: 'double', color: '#e1e1e1' },
    by: { stroke: 'dotted', color: '#e1e1e1' },
  },
};
const config = Config.getFrom(opts);

const recordDict = new Map([
  [
    'paul-otlet',
    new Record(
      {
        id: 'paul-otlet',
        title: 'Paul Otlet',
        types: ['people'],
        links: [
          {
            target: 'traite-documentation',
            type: 'by',
            text: '->',
            contexts: [],
          },
        ],
      },
      config,
    ),
  ],
  [
    'suzanne-briet',
    new Record(
      {
        id: 'suzanne-briet',
        title: 'Suzanne Briet',
        types: ['people'],
        links: [
          {
            target: 'paul-otlet',
            type: 'collab',
            text: '->',
            contexts: [],
          },
        ],
      },
      config,
    ),
  ],
  [
    'traite-documentation',
    new Record(
      {
        id: 'traite-documentation',
        title: 'Traité de documentation',
        types: ['reference'],
      },
      config,
    ),
  ],
]);

const graph = getGraph(recordDict, config);
const graphData = graph.export();

describe('getGraph', () => {
  it('should get nodes, with records attrs', () => {
    expect(graphData.nodes).toEqual([
      {
        key: 'paul-otlet',
        attributes: {
          label: 'Paul Otlet',
          types: ['people'],
          thumbnail: undefined,
          begin: undefined,
          end: undefined,
          size: 20,
        },
      },
      {
        key: 'suzanne-briet',
        attributes: {
          label: 'Suzanne Briet',
          types: ['people'],
          thumbnail: undefined,
          begin: undefined,
          end: undefined,
          size: 2,
        },
      },
      {
        key: 'traite-documentation',
        attributes: {
          label: 'Traité de documentation',
          types: ['reference'],
          thumbnail: undefined,
          begin: undefined,
          end: undefined,
          size: 2,
        },
      },
    ]);
  });

  it('should get edges, with shape and type from opts', () => {
    expect(graphData.edges).toEqual([
      {
        key: expect.any(String),
        source: 'paul-otlet',
        target: 'traite-documentation',
        attributes: {
          type: 'by',
          shape: { stroke: 'dotted', dashInterval: '1, 3' },
        },
      },
      {
        key: expect.any(String),
        source: 'suzanne-briet',
        target: 'paul-otlet',
        attributes: {
          type: 'collab',
          shape: { stroke: 'double', dashInterval: null },
        },
      },
    ]);
  });
});
