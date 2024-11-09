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
const config = new Config(opts);

const records = [
  new Record(
    'paul-otlet',
    'Paul Otlet',
    ['people'],
    [],
    {},
    'Fondateur du Mundaneum',
    Number(new Date('1868')),
    Number(new Date('1944')),
    [
      {
        target: 'traite-documentation',
        type: 'by',
      },
    ],
    'paulotlet.png',
    opts,
  ),
  new Record(
    'suzanne-briet',
    'Suzanne Briet',
    ['people'],
    [],
    {},
    'Pionnière des SIC. Elle collabore avec [[collab:paul-otlet]]',
    Number(new Date('1894')),
    Number(new Date('1989')),
    [],
    'suzannebriet.png',
    opts,
  ),
  new Record(
    'traite-documentation',
    'Traité de documentation',
    ['reference'],
    [],
    {},
    'Otlet, P. (1934). Traité de documentation: Le livre sur le livre, théorie et pratique. Bruxelles: Editiones Mundaneum.',
    undefined,
    undefined,
    [],
    undefined,
    opts,
  ),
];

const graph = getGraph(records, config);
const graphData = graph.export();

describe('getGraph', () => {
  it('should get nodes, with records attrs', () => {
    expect(graphData.nodes).toEqual([
      {
        key: 'paul-otlet',
        attributes: {
          label: 'Paul Otlet',
          types: ['people'],
          thumbnail: 'paulotlet.png',
          begin: -3218832000,
          end: -820540800,
          size: 20,
        },
      },
      {
        key: 'suzanne-briet',
        attributes: {
          label: 'Suzanne Briet',
          types: ['people'],
          thumbnail: 'suzannebriet.png',
          begin: -2398291200,
          end: 599616000,
          size: 2,
        },
      },
      {
        key: 'traite-documentation',
        attributes: {
          label: 'Traité de documentation',
          types: ['undefined'],
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
