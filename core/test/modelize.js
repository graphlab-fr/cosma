const path = require('path');
const Cosmocope = require('../models/cosmoscope');

const { expect } = require('chai');

const fixtureDirPath = path.join(__dirname, './fixture');

describe('Modelize from markdown files', () => {
  const files = Cosmocope.getFromPathFiles(fixtureDirPath);

  it('should find recursively all files in folder', () => {
    expect(files).have.length(3);

    expect(files.map(({ path }) => path)).have.members([
      path.join(fixtureDirPath, 'Paul Otlet.md'),
      path.join(fixtureDirPath, 'Suzanne Briet.md'),
      path.join(fixtureDirPath, '/subfolder', 'Melvil Dewey.md'),
    ]);
  });

  it('should find metas in each file', () => {
    const filePaulOtlet = files.find(({ name }) => name === 'Paul Otlet.md');
    const fileSuzanneBriet = files.find(({ name }) => name === 'Suzanne Briet.md');
    const fileMelvilDewey = files.find(({ name }) => name === 'Melvil Dewey.md');

    expect(filePaulOtlet.metas.title).to.equal('Paul Otlet');
    expect(filePaulOtlet.metas.id).to.equal('20210901132906');
    expect(filePaulOtlet.metas.types).to.deep.equal(['Personne', 'Chercheur']);
    expect(filePaulOtlet.metas.tags).to.deep.equal(['CDU']);
    expect(filePaulOtlet.metas.references).to.deep.equal(['Otlet1930', 'Otlet1934']);
    expect(filePaulOtlet.metas.subtitle).to.equal('Fondateur du Mundaneum et juriste');
    expect(filePaulOtlet.dates.timestamp).to.deep.equal(new Date('2021-09-01 13:29:06'));
    expect(filePaulOtlet.content)
      .to.contain('\n\nPaul Otlet est la tête pensante du Mundaneum')
      .and.to.contain('\n\nIl a consacré toute sa vie')
      .and.to.contain("institutions qui l'entourent.");

    expect(fileSuzanneBriet.metas.title).to.equal('Briet');
    expect(fileSuzanneBriet.metas.id).to.equal('20220801238906'); // fake timestamp : 23h 89min
    expect(fileSuzanneBriet.metas.types).to.deep.equal(['Personne']);
    expect(fileSuzanneBriet.metas.tags).to.deep.equal([]);
    expect(fileSuzanneBriet.metas.references).to.deep.equal([]);
    expect(fileSuzanneBriet.metas.begin).to.equal(-2398291200000);
    expect(fileSuzanneBriet.metas.end).to.equal(599616000000);
    expect(fileSuzanneBriet.dates.timestamp).to.be.undefined;
    expect(fileSuzanneBriet.content)
      .to.contain('\n\nSuzanne Briet est une bibliothécaire')
      .and.to.contain('travaux de recherches.');

    expect(fileMelvilDewey.metas.title).to.equal('Melvil Dewey');
    expect(fileMelvilDewey.metas.id).to.equal('melvil-dewey');
    expect(fileMelvilDewey.metas.types).to.deep.equal(['undefined']);
    expect(fileMelvilDewey.metas.tags).to.deep.equal(['CDD']);
    expect(fileMelvilDewey.metas.references).to.deep.equal(['Dewey1983']);
    expect(fileMelvilDewey.dates.timestamp).to.be.undefined;
    expect(fileMelvilDewey.content)
      .to.contain('\n\nMevil Dewey est un bibliothécaire américain')
      .and.to.contain('apprentissage pour les bibliothécaires.');
  });
});

describe('Modelize from csv files', () => {
  let records, links;

  before(async () => {
    const [formattedRecords, formattedLinks] = await Cosmocope.getFromPathCsv(
      path.join(fixtureDirPath, 'nodes.csv'),
      path.join(fixtureDirPath, 'links.csv'),
    );
    records = formattedRecords;
    links = formattedLinks;
  });

  it('should metas for each record', () => {
    expect(records).have.length(3);

    const [linePaulOtlet, lineSuzanneBriet] = records;

    expect(linePaulOtlet.title).to.equal('Paul Otlet');
    expect(linePaulOtlet.id).to.equal('20210901132906');
    expect(linePaulOtlet.types).to.deep.equal(['Personne', 'Juriste']);
    expect(linePaulOtlet.tags).to.deep.equal(['CDU']);

    expect(lineSuzanneBriet.title).to.equal('Suzanne Briet');
    expect(lineSuzanneBriet.id).to.equal('20220801238906');
    expect(lineSuzanneBriet.types).to.deep.equal(['undefined']);
    expect(lineSuzanneBriet.tags).to.deep.equal([]);
    expect(lineSuzanneBriet.metas.subtitle).to.equal('Madame documentation');
  });

  it('should metas for each link', () => {
    expect(links).have.length(2);

    const [lineBrietToOtlet, lineDeweyToOtlet] = links;

    expect(lineBrietToOtlet.source).to.equal('20220801238906');
    expect(lineBrietToOtlet.target).to.equal('20210901132906');
    expect(lineBrietToOtlet.label).to.equal('Elle qualifie Otlet de "mage"');

    expect(lineDeweyToOtlet.source).to.equal('melvil-dewey');
    expect(lineDeweyToOtlet.target).to.equal('20210901132906');
    expect(lineDeweyToOtlet.ignored).to.be.undefined;
  });
});
