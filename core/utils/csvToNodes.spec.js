import { PassThrough } from 'stream';
import fs from 'fs';
import { processNodes, processNodesOnline } from './csvToNodes';
const { Readable } = require('stream');

jest.mock('fs');

global.fetch = jest.fn();

const config = {
  opts: {
    select_origin: 'directory',
    references_as_nodes: true,
    record_metas: [],
    references_type_label: 'reference',
  },
  canCiteproc: () => true,
  canCssCustom: jest.fn(),
  getConfigConsolMessage: jest.fn(),
  canModelizeFromDirectory: () => true,
  hasRecordType: jest.fn(() => true),
  canSupportRecordMeta: jest.fn(() => true),
};

const csvData = `title,thumbnail,id,type,titre,genre,begin,end,pays,domaine,content,lien wikipédia
Paul Otlet,otlet.jpg,1,Otlet,Fondateur du Mundaneum et juriste,Homme,1868,1944,Belgique,Bibliographie,"Paul Otlet est la tête pensante du Mundaneum, qui est le lieu de rassemblement de la connaissance qui héberge notamment le Répertoire Bibliographique Universel. Il a consacré toute sa vie à développer cet organisme ainsi que le réseau de personnalités et d'institutions qui l'entourent.",https://fr.wikipedia.org/wiki/Paul_Otlet
Suzanne Briet,,2,Personne,« Madame documentation »,Femme,1894,1989,France,"Documentation, Sciences de l'information","Suzanne Briet est une bibliothécaire, pionnière des sciences de l'information et de la communication (SIC) en France. Elle joue un rôle central dans la professionnalisation de la documentation à travers l'Union française des organismes de documentation (UFOD) et l'Institut national des techniques documentaires (INTD). Elle est également vice-présidente de la Fédération internationale de documentation (FID, ex-IIB). Son ouvrage de 1951, « Qu'est-ce que la documentation ? », a fait l'objet de plusieurs travaux de recherches.",https://fr.wikipedia.org/wiki/Suzanne_Briet`;

const csvDataMinimal = `title
Paul Otlet
Suzanne Briet`;

const csvDataWithError = `titre
Paul Otlet
Suzanne Briet`;

describe('processNodes', () => {
  it('should return records without report', async () => {
    const mockStream = new PassThrough();
    mockStream.push(csvData);
    mockStream.push(null);

    fs.createReadStream.mockReturnValue(mockStream);

    const result = await processNodes('fake/path/to/file.csv', config);
    expect(result).toEqual({
      records: [
        expect.objectContaining({ id: '1', config }),
        expect.objectContaining({ id: '2', config }),
      ],
      reportItems: [],
    });
  });

  it('should return report for undefined id', async () => {
    const mockStream = new PassThrough();
    mockStream.push(csvDataWithError);
    mockStream.push(null);

    fs.createReadStream.mockReturnValue(mockStream);

    const result = await processNodes('fake/path/to/file.csv', config);
    expect(result).toEqual({
      records: [],
      reportItems: [
        {
          isError: true,
          locator: {
            file: 'fake/path/to/file.csv',
            line: 2,
          },
          message: '"id" is required',
        },
        {
          isError: true,
          locator: {
            file: 'fake/path/to/file.csv',
            line: 3,
          },
          message: '"id" is required',
        },
      ],
    });
  });

  it('should return report for undefined type', async () => {
    const mockStream = new PassThrough();
    mockStream.push(csvData);
    mockStream.push(null);

    config.hasRecordType.mockReturnValue(false);

    fs.createReadStream.mockReturnValue(mockStream);

    const result = await processNodes('fake/path/to/file.csv', config);
    expect(result).toEqual({
      records: [
        expect.objectContaining({ id: '1', config }),
        expect.objectContaining({ id: '2', config }),
      ],
      reportItems: [
        {
          isError: false,
          locator: {
            file: 'fake/path/to/file.csv',
            line: 2,
          },
          message: 'Type "Otlet" is unknown.',
        },
        {
          isError: false,
          locator: {
            file: 'fake/path/to/file.csv',
            line: 3,
          },
          message: 'Type "Personne" is unknown.',
        },
      ],
    });
  });

  it('should miniaml line', async () => {
    const mockStream = new PassThrough();
    mockStream.push(csvDataMinimal);
    mockStream.push(null);

    fs.createReadStream.mockReturnValue(mockStream);

    const result = await processNodes('fake/path/to/file.csv', config);

    expect(result).toEqual({
      records: [
        expect.objectContaining({ id: 'paul-otlet', config }),
        expect.objectContaining({ id: 'suzanne-briet', config }),
      ],
      reportItems: [],
    });
  });
});
