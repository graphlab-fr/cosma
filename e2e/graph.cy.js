const data = require('./batch/data.json');

describe('graph', () => {
  beforeEach(() => {
    cy.visit('temp/citeproc.html');
  });

  it('should get one node per record', () => {
    cy.visit('temp/batch.html');

    const allTitles = data.map(({ title }) => title);
    cy.shouldGraphHasNodes(allTitles);
  });

  it('should get bibliographic nodes with citeproc', () => {
    cy.shouldGraphHasNodes([
      'Evergreen note titles arelike APIs',
      'Evergreen notes should beatomic',
      'Evergreen notes should beconcept-oriented',
      'Evergreen notes should bedensely linked',
      'Evergreen notes',
      'Tools for thought',
      'Augmenting Human Intellect:A Conceptual Framework',
      'How can we develop transformativetools for thought?',
    ]);
  });

  it('should open record on click on node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').find('text').should('have.text', 'Evergreen notes').click();
    cy.get('.record.active .record-title').should('have.text', 'Evergreen notes');
  });

  it('should hilight links from and to clicked node', () => {
    cy.get('[data-node="evergreen notes"]').as('node');
    cy.get('@node').click();
    cy.get('[data-source="evergreen notes"]')
      .should('have.length', 1)
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
    cy.get('[data-target="evergreen notes"]')
      .should('have.length', 3)
      .each((elt) => expect(elt.attr('style')).to.contain('highlight'));
  });
});
