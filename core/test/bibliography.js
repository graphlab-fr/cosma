import assert from 'assert';
import { should } from 'chai';
import Bibliography from '../models/bibliography.js';
import { fetchBibliographyFiles } from '../utils/generate.js';
import { config as configFake } from '../utils/fake.js';

let bibliography;

before(() => {
  return new Promise((resolve) => {
    fetchBibliographyFiles().then(() => {
      const { bib, cslStyle, xmlLocal } = Bibliography.getBibliographicFilesFromConfig(configFake);
      bibliography = new Bibliography(bib, cslStyle, xmlLocal);
      resolve();
    });
  });
});

describe('Bibliography', () => {
  it('should extract bibliographic records from text', () => {
    const text = 'Lorem ipsum [@Goody_1979, 12] dolor est [@Akrich_2016 ; @Chun_2008, 24]';
    const bibliographicRecords = Bibliography.getBibliographicRecordsFromText(text);
    bibliographicRecords.should.have.length(2);

    const [recordGoody, recordAkrichChun] = bibliographicRecords;
    const { record, cluster } = bibliography.get(recordGoody);
    cluster.should.to.include('Goody').and.include('12');
    record[0].should.to.include('La Raison graphique: la domestication de la pensée sauvage');
  });

  it('should extract bibliographic records from list', () => {
    const list = ['Goody_1979', 'Chun_2008'];
    const bibliographicRecords = Bibliography.getBibliographicRecordsFromList(list);

    const [recordGoody, recordChun] = bibliographicRecords;
    const { record, cluster } = bibliography.get(recordChun);
    cluster.should.to.include('Chun');
    record[0].should.to.include('Code as Fetish');
  });

  it('should extract ignore unknowned authors records from text', () => {
    const text = 'Lorem ipsum [@Out_library_author, 1 ; @Goody_1979] dolor est';
    const bibliographicRecords = Bibliography.getBibliographicRecordsFromText(text);

    const [recordUnknownedGoody] = bibliographicRecords;
    const { record, cluster } = bibliography.get(recordUnknownedGoody);
    cluster.should.to.include('Goody');
    record[0].should.to.include('La Raison graphique: la domestication de la pensée sauvage');
  });
});
