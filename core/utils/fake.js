/**
 * @file Generate a fake cosmoscope.
 * @author Guillaume Brioudes
 * @copyright GNU GPL 3.0 ANR HyperOtlet
 */

/**
 * @typedef FakeView
 * @type {object}
 * @property {number} withFilters
 * @property {number} withTags
 * @property {number} withFocus
 * @property {boolean} withRecord
 */

const path = require('path');
const { faker } = require('@faker-js/faker'),
  nunjucks = require('nunjucks');

const Config = require('../models/config'),
  Cosmoscope = require('../models/cosmoscope'),
  Record = require('../models/record');

const { getTimestampTuple } = require('./misc');

const bib = require('../static/fake/bib.json');
const tempDirPath = path.join(__dirname, '../temp');

const tags = [];
const bibKeys = Object.values(bib).map(({ id }) => `${id}`);

for (let i = 0; i < 5; i++) {
  tags.push(faker.random.word());
}

let config = Config.get(path.join(__dirname, '../static/fake/config.yml'));
const { record_types: recordTypes } = config.opts;
const recordTypesWithoutReferences = Object.keys(recordTypes).filter(
  (type) => type !== config.opts['references_type_label'],
);
config.opts['images_origin'] = tempDirPath;
config.opts['csl'] = path.join(tempDirPath, 'iso690.csl');
config.opts['csl_locale'] = path.join(tempDirPath, 'locales-fr-FR.xml');
config.opts['css_custom'] = path.join(__dirname, '../static/fake/style.css');
config.opts['bibliography'] = path.join(__dirname, '../static/fake/bib.json');
config.opts['views'] = {
  [faker.word.verb()]: fakeView({ withFilters: 2, withFocus: 2 }),
  [faker.word.verb()]: fakeView({ withFilters: 3, withTags: 1 }),
  withFilters: fakeView({ withFilters: 2 }),
  withTags: fakeView({ withTags: 1 }),
  withFocus: fakeView({ withFocus: 1 }),
};
const typesThumbnails = Array.from(config.getTypesRecords())
  .filter((type) => config.getFormatOfTypeRecord(type) === 'image')
  .map((type) => recordTypes[type]['fill']);
const images = ['exemple-image.jpeg'];

const templateEngine = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, '../static')),
);

/**
 * Generate many records with fake default values
 * @param {number} nb Number of records to generate
 * @param {Config.opts} opts
 * @returns {Record[]}
 */

function getRecords(nb, opts = config.opts) {
  const ids = [];
  for (let i = 0; i < nb; i++) {
    ids.push(Record.generateOutDailyId() + i);
  }

  const files = [];
  for (const fileId of ids) {
    const content = templateEngine.render('fake/record.njk', {
      ids,
      imgSrc: images[0],
      bibKeys,
    });

    const thumbnail = `${fileId}.jpg`;
    // nodeThumbnails.push(thumbnail);

    const { begin, end } = fakeExtremeDates();

    files.push({
      path: undefined,
      name: faker.system.commonFileName('md'),
      lastEditDate: faker.date.past(),
      content,
      metas: {
        id: fileId,
        title: faker.name.jobTitle(),
        types: faker.helpers.arrayElements(recordTypesWithoutReferences, 2),
        tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
        thumbnail: undefined,
        references: ['Masure_2014'],
        ['phone number']: faker.phone.number('06 ## ## ## ##'),
        begin,
        end,
      },
    });
  }

  return Cosmoscope.getRecordsFromFiles(files, true, opts);
}

module.exports = {
  config,
  getRecords,
  bib,
  typesThumbnails,
  images,
};

/**
 * @param {FakeView} params
 * @returns {string}
 */

function fakeView({ withFilters, withTags, withFocus, withThisRecordId }) {
  const fakeHost = 'https://fake.fr/';
  let url = new URL(fakeHost);

  if (withFilters) {
    url.searchParams.set(
      'filters',
      faker.helpers.arrayElements(recordTypesWithoutReferences, withFilters).join('-'),
    );
  }
  if (withTags) {
    url.searchParams.set('tags', faker.helpers.arrayElements(tags, withTags).join('-'));
  }
  if (withFocus) {
    url.searchParams.set('focus', withFocus);
  }
  if (withThisRecordId) {
    url.hash = faker.helpers.arrayElement(withThisRecordId);
  }

  url = url.toString().split(fakeHost)[1];

  return url;
}

/**
 * @returns {{ begin: string, end: string }}
 * @exemple
 * ```
 * { begin: '2020-02-10', end: '2024-02-10' }
 * ```
 */

function fakeExtremeDates() {
  const beginDate = faker.datatype.datetime({
    min: new Date('2000-01-01'),
    max: new Date('2010-01-01'),
  });
  const [beginYear, beginMonth, beginDay] = getTimestampTuple(beginDate);

  const endDate = faker.datatype.datetime({
    min: new Date('2010-01-01'),
    max: new Date('2020-01-01'),
  });
  const [endYear, endMonth, endDay] = getTimestampTuple(endDate);

  return {
    begin: [beginYear, beginMonth, beginDay].join('-'),
    end: [endYear, endMonth, endDay].join('-'),
  };
}
